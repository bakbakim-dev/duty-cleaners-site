import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { absoluteAssetUrl, ARTICLE_AUTHOR, ARTICLE_PUBLISHER } from "@/lib/seo";
import { modifiedFor } from "@/data/post-dates";
import { canonicalUrlForPath } from "@/data/legacy-urls";
import { Calendar, Clock, ArrowLeft, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import heroImage from "@/assets/blog/vinegar-baking-soda-hero.webp";
import sinkImage from "@/assets/blog/cleaning-sink-baking-soda.webp";
import bathroomImage from "@/assets/blog/bathroom-faucet-cleaning.webp";
import laundryImage from "@/assets/blog/laundry-natural-cleaning.webp";

const whatToClean = [
  {
    title: "Kitchen Sink",
    description: "Did you know that the kitchen sink carries more bacteria than the toilet and garbage can? For the sink, sprinkle baking soda on the surface before scrubbing and rinsing it off. Soak paper towels in distilled white vinegar and let them line the sink for 20 minutes before wiping the cover down."
  },
  {
    title: "Clogged Drains and Garbage Disposals",
    description: "To unclog drains, pour baking soda and add 2 cups of white vinegar. The two will react together, which will help break down grime, grease, and dirt. Wait until the mixture stops bubbling before flushing the drain with boiling water. For garbage disposals, dump half a cup of baking soda into the disposal and let it stay for 10 minutes to deodorize, then pour vinegar in and let the mixture bubble."
  },
  {
    title: "Faucets",
    description: "Get sparking clean faucets by making a baking soda paste: add a tablespoon of baking soda and water with the same amount of vinegar. Use the paste to cover all chrome areas of the sink. Let it remain for at least 15 minutes. After that, scrub those areas and buff them to get the sparkle."
  },
  {
    title: "Refrigerator",
    description: "The fridge can be cleaned with baking soda and vinegar separately. Fill a spray bottle with equal parts vinegar and water to wipe down your surfaces in the refrigerator. Mix baking soda with hot water and wipe it onto the fridge's interior. Leave it for a few minutes, then rinse it cleanly."
  },
  {
    title: "Bathroom Surfaces",
    description: "Mix 1 and 2/3 cups of baking soda and a half cup of liquid soap in a bowl. Mix half a cup of water with 2 tablespoons of white vinegar. Combine them and stir thoroughly to remove any lumps. Put the mixture into a spray bottle and shake well. Spray the mixture on your bathroom surfaces and use a nylon-backed sponge to scrub it. Rinse all surfaces with water."
  },
  {
    title: "Showerheads",
    description: "If your showerhead is clogged with minerals, vinegar can help clear it. Mix 1 cup of vinegar and one quart of water to make a cleaning solution. Let the showerhead soak in the mixture for 15 minutes. Afterward, rinse it off before replacing the showerhead."
  },
  {
    title: "Toilet Bowl",
    description: "Add equal parts baking soda and hydrogen peroxide. Use a toilet brush to rub the mixture around the bowl. Leave the solution for at least 15 minutes, then scrub and rinse the sparkling bowl."
  },
  {
    title: "Carpet Stains",
    description: "Combine two tablespoons of salt with four tablespoons of white vinegar and lightly rub into carpet stains. Wait to vacuum until the solution has dried."
  },
  {
    title: "Laundry Detergent Booster",
    description: "Add half a cup of baking soda to your clothes before the wash cycle in the washing machine. Then, add vinegar to the rinse cycle. Baking soda can boost your liquid laundry detergent cleaning process and brighten your clothes, while vinegar removes the foul odour and softens the fabric."
  }
];

const whatNotToClean = [
  {
    title: "Clothes Iron",
    description: "Do not add vinegar to the clothes iron because it can permanently damage the inside as the acid eats away the lining and metal parts."
  },
  {
    title: "Mirrors",
    description: "Products with an acidic component can damage the backing of mirrors and should, therefore, never use vinegar to remove stubborn stains."
  },
  {
    title: "Marble, Granite, or Stone Counters",
    description: "You should never use these two in cleaning natural stone or marble surfaces. Both can make them lose their shine. Instead, use a liquid cleaner with water for the best results."
  },
  {
    title: "Wood Floors and Furniture",
    description: "Vinegar can damage the finish that protects the wood and leaves it cloudy and dull. It is always best to use cleaning products recommended and formulated for wood floors and furniture."
  }
];

export default function BlogVinegarBakingSoda() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Cleaning with Vinegar and Baking Soda | Duty Cleaners</title>
        <meta
          name="description"
          content="Learn how to clean your home naturally with vinegar and baking soda. Safe, effective tips for kitchen, bathroom and laundry from Duty Cleaners."
        />
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-with-vinegar-and-baking-soda/" />
        <meta property="og:title" content="Cleaning with Vinegar and Baking Soda | Duty Cleaners" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cleaning with Vinegar and Baking Soda | Duty Cleaners" />
        <meta name="twitter:description" content="Learn how to clean your home naturally with vinegar and baking soda. Safe, effective tips for kitchen, bathroom and laundry from Duty Cleaners." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-with-vinegar-and-baking-soda/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Cleaning with Vinegar and Baking Soda: Complete Guide",
          "description": "Learn how to clean your home naturally with vinegar and baking soda. Safe, effective cleaning tips for kitchen, bathroom, laundry and more from Duty Cleaners Edmonton.",
          "image": absoluteAssetUrl(heroImage),
          "datePublished": "2026-01-25",
          "dateModified": modifiedFor("/cleaning-with-vinegar-and-baking-soda", "2026-01-25"),
          "author": ARTICLE_AUTHOR,
          "publisher": ARTICLE_PUBLISHER,
          "mainEntityOfPage": canonicalUrlForPath("/cleaning-with-vinegar-and-baking-soda")
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
            <Link to="/blog">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
            
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                  Green Cleaning
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  January 25, 2026
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  15 min read
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                Cleaning with Vinegar and Baking Soda
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Skip the harsh chemicals! Learn how to use these two natural household items to clean almost everything in your home safely and effectively.
              </p>

              <div className="aspect-video rounded-2xl overflow-hidden mb-12">
                <img width={1920} height={1080}
                  src={heroImage}
                  alt="Baking soda and white vinegar on a clean kitchen counter - natural cleaning supplies"
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
                  {/*
                    This opening was un-edited WordPress-era copy and it said the
                    opposite of what it meant: "unsafe to use in every household"
                    reads as "unsafe everywhere" when the point was that harsh
                    products do not suit every home. It also called household items
                    "skilled", which objects cannot be. The rest of the article is
                    recent and accurate; only the intro had been left behind.
                  */}
                  Most cleaning aisles are built around strong, single-purpose products, and plenty of homes have good reasons to want fewer of them around — young children, pets, sensitive skin, or a bathroom with no window and nowhere for fumes to go.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  <strong>Vinegar and baking soda</strong> cover a surprising amount of that ground between them, and both are cheap enough that it costs nothing to try. What follows is where each one genuinely works, where it does not, and — the part most guides get wrong — what actually happens when you combine them.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  The downside is we can't use these products to clean everything in your house. But they are still safer than using cleaners with harsh chemicals. This blog will teach you different techniques and how and when to use or not use them.
                </p>
              </div>

              {/* Can you clean section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  Can You Clean with Vinegar and Baking Soda?
                </h2>
                
                {/* The original copy claimed that combining opposite ends of the pH
                    scale makes a *more* effective cleaner. That is the single most
                    fact-checked claim in domestic cleaning, and it is wrong — an acid
                    and a base neutralise each other. The article already contradicted
                    itself further down ("similar to cleaning with plain water" once the
                    fizzing stops). Corrected here so the two agree, and so a cleaning
                    company is not publishing chemistry its own next section refutes. */}
                <p className="text-muted-foreground mb-6">
                  You'd be surprised at how many things in your home you can clean with baking soda and vinegar. Each one is a capable cleaner in its own right — and that is the important part. Baking soda is a mild alkali and a gentle abrasive; vinegar is a weak acid that dissolves mineral deposits and soap scum. They are at opposite ends of the pH scale, so combining them does not make a stronger cleaner. It makes a weaker one: the acid and the base cancel each other out, and what is left is mostly water.
                </p>

                <p className="text-muted-foreground mb-6">
                  That fizzing reaction is still genuinely useful, but for a mechanical reason rather than a chemical one — the carbon dioxide bubbles lift loose debris, which is why the combination works in a slow drain. For everything else, you will get better results using them separately, one after the other, than mixed together in a bowl.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 bg-primary/10 rounded-xl border border-primary/20">
                    <h4 className="font-bold text-foreground mb-2">🧂 Baking Soda (Base)</h4>
                    <p className="text-muted-foreground text-sm">
                      Also known as sodium bicarbonate, baking soda can dissolve some compounds, including grease and dirt. It's also a natural abrasive cleaner that can serve as an excellent cleaning agent without fear of damaging your surfaces.
                    </p>
                  </div>
                  <div className="p-6 bg-secondary/10 rounded-xl border border-secondary/20">
                    <h4 className="font-bold text-foreground mb-2">🍶 Vinegar (Acid)</h4>
                    <p className="text-muted-foreground text-sm">
                      Vinegar is an acid that can break down minerals – including hard water stains. By combining it with baking soda, you can make your home sparkling clean in no time.
                    </p>
                  </div>
                </div>
              </div>

              {/* How to Mix Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  How to Mix Vinegar and Baking Soda to Clean
                </h2>

                <div className="aspect-video rounded-xl overflow-hidden mb-6">
                  <img width={1024} height={1024}
                    src={sinkImage}
                    alt="Hands with yellow gloves scrubbing kitchen sink with baking soda paste"
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="text-muted-foreground mb-6">
                  There are concrete ways to combine these products before you start cleaning. The mixture needs to be either acidic or basic to be effective. So it is advisable <strong>not to use equal parts of baking soda and vinegar</strong>.
                </p>

                <div className="p-6 bg-accent/20 rounded-xl border border-accent/30 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-accent-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-foreground mb-2">Pro Tip: Use It While It's Still Fizzing</h4>
                      <p className="text-muted-foreground text-sm">
                        If you do combine them, use the mixture straight away. The carbon dioxide bubbles do the useful work by lifting loose debris, so the mixture is at its most helpful while it is still fizzing. Once it stops, the acid and base have neutralised each other and what remains is close to plain water. That is the whole reason we suggest using them one after the other rather than pre-mixed.
                      </p>
                    </div>
                  </div>
                </div>

                {/* This article recommends a baking soda + hydrogen peroxide toilet
                    mixture. Published in a piece that is otherwise about vinegar, with
                    no warning, that is a genuine hazard: a reader combining the two
                    makes peracetic acid. Never-mix guidance belongs in any article that
                    tells people to combine household chemicals. */}
                <div className="p-6 bg-destructive/10 rounded-xl border-2 border-destructive/40 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-foreground mb-2">Never mix these, whatever you read online</h4>
                      <ul className="text-muted-foreground text-sm list-disc pl-5 space-y-1.5">
                        <li>
                          <strong>Vinegar and hydrogen peroxide.</strong> Combining them makes peracetic acid, which can irritate skin, eyes and airways. Use one, rinse the surface thoroughly, then use the other — never in the same container.
                        </li>
                        <li>
                          <strong>Vinegar and bleach.</strong> This releases chlorine gas. This combination is genuinely dangerous, not merely ineffective.
                        </li>
                        <li>
                          <strong>Bleach and ammonia</strong> (including many glass cleaners). Releases chloramine vapour.
                        </li>
                      </ul>
                      <p className="text-muted-foreground text-sm mt-3">
                        Whenever you switch products, rinse the surface with water first, and open a window. If you ever notice a sharp smell or start coughing, leave the room and let it air out.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What to Clean */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  What to Clean with Vinegar and Baking Soda
                </h2>

                <p className="text-muted-foreground mb-6">
                  Both baking soda and vinegar are versatile in the many areas and surfaces they can clean. However, it's important to remember that the same combination of ingredients might only work for some things. You may need to create different mixtures for different surfaces.
                </p>

                <div className="space-y-4">
                  {whatToClean.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid md:grid-cols-2 gap-6">
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <img width={1024} height={1024}
                      src={bathroomImage}
                      alt="Clean modern bathroom with sparkling chrome faucet"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <img width={1024} height={1024}
                      src={laundryImage}
                      alt="Clean laundry room with washing machine and natural cleaning supplies"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* What NOT to Clean */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  When NOT to Clean with Vinegar and Baking Soda
                </h2>

                <p className="text-muted-foreground mb-6">
                  Unfortunately, baking soda and vinegar cannot be used in all situations. Some surfaces can be damaged if they come into contact with these ingredients. Although these two may not always work, other cleaning materials you can use will be more effective.
                </p>

                <div className="space-y-4">
                  {whatNotToClean.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                      <XCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  Trust the Cleaning Professionals
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Are you trying to figure out which cleaners are best for your home? Leave the cleaning to us! The professionals at Duty Cleaners will ensure your home is thoroughly clean with our top-of-the-line products — and when vinegar and baking soda have met their match, our <Link to="/edmonton/deep-cleaning/" className="text-primary hover:underline font-medium">deep cleaning service</Link> handles the built-up grime they can’t. No matter your preference – natural remedies or professional-grade solutions – our cleaners will work with you to ensure your needs are met.
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
