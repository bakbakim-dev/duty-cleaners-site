import { modifiedOr, publishedFor } from "@/data/post-published";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { absoluteAssetUrl, ARTICLE_AUTHOR, ARTICLE_PUBLISHER } from "@/lib/seo";
import { modifiedFor } from "@/data/post-dates";
import { canonicalUrlForPath } from "@/data/legacy-urls";
import { Calendar, Clock, ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import heroImage from "@/assets/blog/vinegar-baking-soda-hero.webp";
import sinkImage from "@/assets/blog/cleaning-sink-baking-soda.webp";
import bathroomImage from "@/assets/blog/bathroom-faucet-cleaning.webp";
import laundryImage from "@/assets/blog/laundry-natural-cleaning.webp";

const whatToClean = [
  {
    title: "Kitchen Sink",
    description: "Identify the sink material and coating first. Use the manufacturer's recommended cleaner and a compatible cloth. Vinegar and abrasive powders are not suitable for every sink, so do not apply a generic soaking recipe to an unknown finish."
  },
  {
    title: "Clogged Drains and Garbage Disposals",
    description: "Do not rely on a fizzing mixture to clear a blockage, and never add it to a drain containing another cleaner. Follow the disposal's maintenance instructions. If a drain stays slow or blocked, stop adding products and seek appropriate plumbing help. Drain clearing is not a Duty Cleaners service."
  },
  {
    title: "Faucets",
    description: "Follow the care guide for the exact faucet finish. Some manufacturers permit a diluted vinegar solution briefly on certain finishes and prohibit harsh or abrasive cleaners on others. Do not wrap an unknown finish in vinegar or scrub it with baking soda."
  },
  {
    title: "Refrigerator",
    description: "Use your refrigerator's care instructions for liners, shelves and seals. Remove food before cleaning and follow the specified washing, rinsing and drying steps. Do not assume vinegar or an abrasive paste is approved for every internal surface."
  },
  {
    title: "Bathroom Surfaces",
    description: "Check whether the tub, tile, grout and shower glass have coatings or special care requirements. Choose a compatible product and follow its label; an acid or abrasive can damage an unsuitable surface. Never mix bathroom cleaners."
  },
  {
    title: "Showerheads",
    description: "Consult the showerhead manufacturer's descaling instructions. The finish and internal parts determine whether vinegar is permitted and, if so, the dilution and contact time. Do not substitute a general soaking time for those instructions."
  },
  {
    title: "Toilet Bowl",
    description: "Use a toilet-cleaning product approved for your fixture and follow the label. Do not add vinegar, hydrogen peroxide or another product to a bowl that contains cleaner, including an in-tank cleaning product. This guide does not recommend homemade mixtures."
  },
  {
    title: "Carpet Stains",
    description: "Follow the carpet manufacturer's stain guide for the fibre and stain involved. Test an approved product in a hidden area as directed. A generic vinegar recipe can affect dyes or backing, and cleaning does not guarantee removal of a stain."
  },
  {
    title: "Laundry and Washing Machines",
    description: "Use the detergent and maintenance products specified for your machine, and follow garment care labels. Do not routinely add vinegar as a softener or washer cleaner: some manufacturers warn that its acidity can damage seals and hoses. Never combine it with bleach."
  }
];

const whatNotToClean = [
  {
    title: "Clothes Iron",
    description: "Do not add vinegar to the clothes iron because it can permanently damage the inside as the acid eats away the lining and metal parts."
  },
  {
    title: "Mirrors",
    description: "Vinegar can creep under the edge of a mirror and attack the silvered backing, so keep it off them. Use a plain glass cleaner, or warm water and a drop of dish soap, then buff dry with a microfibre cloth."
  },
  {
    title: "Marble, Granite, or Stone Counters",
    description: "Keep both off natural stone such as marble and granite. Vinegar can etch the surface and baking soda can scratch it, and either one can dull the shine. Use a cleaner made for stone, diluted in water, instead."
  },
  {
    title: "Wood Floors and Furniture",
    description: "Vinegar can damage the finish that protects the wood and leaves it cloudy and dull. Use cleaning products made for wood floors and furniture instead."
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
          content="Where vinegar and baking soda work in the kitchen, bathroom and laundry, which surfaces they damage, and why mixing them makes a weaker cleaner."
        />
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-with-vinegar-and-baking-soda/" />
        <meta property="og:title" content="Cleaning with Vinegar and Baking Soda | Duty Cleaners" />
        <meta property="og:description" content="Where vinegar and baking soda work in the kitchen, bathroom and laundry, which surfaces they damage, and why mixing them makes a weaker cleaner." />
        <meta name="twitter:card" content="summary_large_image" />
        {/* This post's own hero, so a share card shows the article rather
            than the generic site image. */}
        <meta property="og:image" content={absoluteAssetUrl(heroImage)} />
        <meta name="twitter:image" content={absoluteAssetUrl(heroImage)} />
        <meta name="twitter:title" content="Cleaning with Vinegar and Baking Soda | Duty Cleaners" />
        <meta name="twitter:description" content="Where vinegar and baking soda work in the kitchen, bathroom and laundry, which surfaces they damage, and why mixing them makes a weaker cleaner." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-with-vinegar-and-baking-soda/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Cleaning with Vinegar and Baking Soda: Complete Guide",
          "description": "Where vinegar and baking soda work in the kitchen, bathroom and laundry, which surfaces they damage, and why mixing them makes a weaker cleaner.",
          "image": absoluteAssetUrl(heroImage),
          ...(publishedFor("/cleaning-with-vinegar-and-baking-soda") ? { datePublished: publishedFor("/cleaning-with-vinegar-and-baking-soda") } : {}),
          "dateModified": modifiedOr("/cleaning-with-vinegar-and-baking-soda"),
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
            <Button variant="ghost" className="mb-6" asChild>
              <Link to="/blog/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
            
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                  Green Cleaning
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  January 25, 2026
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                Cleaning with Vinegar and Baking Soda
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Two cheap household staples handle a lot of everyday cleaning, as long as you use them one at a time and keep them off the surfaces they damage.
              </p>

              <div className="aspect-video rounded-2xl overflow-hidden mb-12">
                <img width={1920} height={1080}
                  src={heroImage}
                  alt="Baking soda and white vinegar on a clean kitchen counter - natural cleaning supplies"
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
                  {/*
                    This opening was un-edited WordPress-era copy and it said the
                    opposite of what it meant: "unsafe to use in every household"
                    reads as "unsafe everywhere" when the point was that harsh
                    products do not suit every home. It also called household items
                    "skilled", which objects cannot be. The rest of the article is
                    recent and accurate; only the intro had been left behind.
                  */}
                  Vinegar and baking soda are inexpensive household ingredients, but natural does not mean harmless or suitable for every surface. Keep cleaning supplies away from children and pets, follow labels and provide the ventilation the instructions require.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  <strong>Vinegar and baking soda</strong> cover a lot of that ground between them, and both are cheap enough to be worth trying. What follows is where each one works, where it does not, and what happens when you combine them, which is the part many guides get wrong.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  Neither one cleans everything. Vinegar can damage natural stone, wood finishes, the backing of a mirror and the inside of a clothes iron, and neither replaces a purpose-made disinfectant.
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
                  That fizzing reaction is still useful, but for a mechanical reason rather than a chemical one — the carbon dioxide bubbles lift loose debris, which is why the combination works in a slow drain. For everything else, you will get better results using them separately, one after the other, than mixed together in a bowl.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 bg-primary/10 rounded-xl border border-primary/20">
                    <h3 className="font-bold text-foreground mb-2">🧂 Baking Soda (Base)</h3>
                    <p className="text-muted-foreground text-sm">
                      Baking soda (sodium bicarbonate) is a mild alkali that loosens grease and dirt, and a fine abrasive that scrubs without much force. Test it on a hidden patch of a glossy or soft finish first, because it can scratch.
                    </p>
                  </div>
                  <div className="p-6 bg-secondary/10 rounded-xl border border-secondary/20">
                    <h3 className="font-bold text-foreground mb-2">🍶 Vinegar (Acid)</h3>
                    <p className="text-muted-foreground text-sm">
                      Vinegar is a weak acid, so it dissolves the mineral scale that hard Alberta water leaves on taps, shower glass and kettles. Use it on its own and rinse afterwards — it does that job better alone than neutralised by baking soda.
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
                   loading="lazy" decoding="async"/>
                </div>

                <p className="text-muted-foreground mb-6">
                  Choose a cleaning method approved for the surface. <strong>Do not improvise mixtures or store vinegar and baking soda together in a sealed container.</strong>
                </p>

                <div className="p-6 bg-accent/20 rounded-xl border border-accent/30 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-accent-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-foreground mb-2">Fizzing is not proof of a better clean</h3>
                      <p className="text-muted-foreground text-sm">
                        Bubbles show that a reaction is occurring, not that a surface is disinfected or a drain is cleared. Use an appropriate product as directed instead of treating the reaction as a cleaning-performance test.
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
                          <strong>Vinegar and hydrogen peroxide.</strong> Combining them can form irritating peracetic acid. Do not mix them or improvise a sequence of different cleaners.
                        </li>
                        <li>
                          <strong>Vinegar and bleach.</strong> This <a href="https://tc.canada.ca/en/dangerous-goods/canutec/articles/improper-mixing-common-household-cleaning-products" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">releases chlorine gas</a>. This combination is genuinely dangerous, not merely ineffective.
                        </li>
                        <li>
                          <strong>Bleach and ammonia</strong> (including many glass cleaners). Releases chloramine vapour.
                        </li>
                      </ul>
                      <p className="text-muted-foreground text-sm mt-3">
                        Follow <a href="https://www.canada.ca/en/health-canada/services/home-safety/household-chemical-safety.html" target="_blank" rel="noopener noreferrer" className="text-primary underline">Health Canada's household chemical safety guidance</a> and the product label. If you suspect harmful exposure, move away from the source and contact your poison centre or emergency services as appropriate; do not stay in the room to troubleshoot.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What to Clean */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  Where to Check Before Using Vinegar or Baking Soda
                </h2>

                <p className="text-muted-foreground mb-6">
                  These are compatibility checks, not universal recipes. See the <a href="https://solutions.moen.com/Article_Library/Faucet_Finish_Care_and_Cleaning" target="_blank" rel="noopener noreferrer" className="text-primary underline">Moen finish-care guide</a> for an example of finish-specific directions and <a href="https://www.whirlpool.com/blog/washers-and-dryers/should-you-clean-washing-machine-with-vinegar.html" target="_blank" rel="noopener noreferrer" className="text-primary underline">Whirlpool's vinegar guidance</a> for appliance limitations. Use the guide for your own make and model.
                </p>

                <div className="space-y-4">
                  {whatToClean.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid md:grid-cols-2 gap-6">
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <img width={1024} height={1024}
                      src={bathroomImage}
                      alt="Clean modern bathroom with a chrome faucet"
                      className="w-full h-full object-cover"
                     loading="lazy" decoding="async"/>
                  </div>
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <img width={1024} height={1024}
                      src={laundryImage}
                      alt="Clean laundry room with washing machine and natural cleaning supplies"
                      className="w-full h-full object-cover"
                     loading="lazy" decoding="async"/>
                  </div>
                </div>
              </div>

              {/* What NOT to Clean */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  When NOT to Clean with Vinegar and Baking Soda
                </h2>

                <p className="text-muted-foreground mb-6">
                  Baking soda and vinegar cannot be used everywhere. Some surfaces are damaged by them, and for those a product made for the surface does a better job.
                </p>

                <div className="space-y-4">
                  {whatNotToClean.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                      <XCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  When the Grime Has Built Up
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  When built-up grime is past what vinegar and baking soda can shift, a deep clean is the standard checklist plus the deep-clean package for baseboards, doors, light switches, wall outlets and vent covers. Duty Cleaners books <Link to="/edmonton/deep-cleaning/" className="text-primary underline underline-offset-2 font-medium">deep cleaning in Edmonton</Link> and <Link to="/calgary/deep-cleaning/" className="text-primary underline underline-offset-2 font-medium">deep cleaning in Calgary</Link>. The team brings all supplies and equipment, and optional alternative products are a paid add-on: ask the office which products are available and suitable for your surfaces when you book.
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
