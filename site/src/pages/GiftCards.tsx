import { HOMES_CLEANED } from "@/data/proof";
import { RATING_CLAIM } from "@/data/proof";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GiftCardDesignCard from "@/components/gift-cards/GiftCardDesignCard";
import HowItWorksStep from "@/components/gift-cards/HowItWorksStep";
import InfoCard from "@/components/gift-cards/InfoCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import giftCardsHero from "@/assets/gift-cards-hero.webp";
import { giftCardGuide } from "@/data/gift-cards";
import { POLICY } from "@/data/policy";
import {
  Gift, Heart, PartyPopper, Sparkles, Clock, CreditCard,
  Send, Shield, Snowflake, Award, HeartHandshake, Home,
  Star, Phone, BadgeCheck, Users
} from "lucide-react";

const giftCardDesigns = [
  { id: "congratulations", name: "Congratulations", icon: PartyPopper, gradient: "from-orange-400 via-orange-500 to-amber-600", bgPattern: "bg-gradient-to-br", description: "For a graduation, a promotion or a finish line" },
  { id: "thank-you", name: "Thank You", icon: Heart, gradient: "from-teal-500 via-teal-600 to-cyan-700", bgPattern: "bg-gradient-to-br", description: "A thank-you that saves them an afternoon" },
  { id: "happy-for-you", name: "Happy for You", icon: Sparkles, gradient: "from-teal-400 via-orange-400 to-amber-500", bgPattern: "bg-gradient-to-br", description: "For good news of any kind" },
  { id: "happy-holidays", name: "Happy Holidays", icon: Snowflake, gradient: "from-cyan-400 via-teal-500 to-teal-700", bgPattern: "bg-gradient-to-br", description: "A clean home before the guests arrive, or after they leave" },
  { id: "you-deserve-it", name: "Well Earned", icon: Award, gradient: "from-amber-400 via-orange-500 to-orange-600", bgPattern: "bg-gradient-to-br", description: "For someone who has been carrying more than their share" },
  { id: "happy-anniversary", name: "Happy Anniversary", icon: HeartHandshake, gradient: "from-rose-400 via-pink-500 to-fuchsia-600", bgPattern: "bg-gradient-to-br", description: "A clean house instead of another set of glasses" },
  { id: "new-home", name: "Housewarming", icon: Home, gradient: "from-emerald-400 via-teal-500 to-cyan-600", bgPattern: "bg-gradient-to-br", description: "A move-in clean before the boxes come off the truck" },
];

// Gift cards are purchased through our BookingKoala storefront.
const GIFT_CARD_PURCHASE_URL = "https://dutycleaners.bookingkoala.com/gift-card";

const buyingGuide = giftCardGuide();

const howItWorksSteps = [
  { icon: CreditCard, step: "1", title: "Choose Amount", description: "Select how much you'd like for the gift card" },
  { icon: Gift, step: "2", title: "Pick a Design", description: "Choose from our beautiful card designs" },
  { icon: Send, step: "3", title: "Add Details", description: "Fill in recipient's name and personal message" },
  { icon: Sparkles, step: "4", title: "Instant Delivery", description: "We send the gift card instantly via email" },
];

export default function GiftCards() {
  const [selectedDesign, setSelectedDesign] = useState<string>("congratulations");
  const { ref: heroRef } = useScrollAnimation();
  const { ref: designsRef } = useScrollAnimation();
  const { ref: howItWorksRef } = useScrollAnimation();
  const { ref: guideRef } = useScrollAnimation();
  const { ref: infoRef } = useScrollAnimation();
  const { ref: ctaRef } = useScrollAnimation();

  return (
    <>
      <Helmet>
        <title>Cleaning Gift Cards | Duty Cleaners Edmonton & Calgary</title>
        <meta name="description" content="A house cleaning gift card for Edmonton or Calgary, in any amount, with no expiry. Pick a design, add a message, and it is emailed to them." />
        {/* Near-duplicate of /gift-card (the linked page) — consolidate signals there. */}
        <link rel="canonical" href="https://dutycleaners.ca/gift-card/" />
        <meta property="og:title" content="Cleaning Gift Cards | Duty Cleaners Edmonton & Calgary" />
        <meta property="og:description" content="A house cleaning gift card for Edmonton or Calgary, in any amount, with no expiry. Pick a design, add a message, and it is emailed to them." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/gift-cards/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cleaning Gift Cards | Duty Cleaners Edmonton & Calgary" />
        <meta name="twitter:description" content="A house cleaning gift card for Edmonton or Calgary, in any amount, with no expiry. Pick a design, add a message, and it is emailed to them." />
      </Helmet>

      <div className="min-h-screen">
        <Navigation />
        <main id="main-content" tabIndex={-1}>
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero Section */}
        <section className="bg-brand-navy py-20 md:py-28 relative overflow-hidden">
          {/* Background image */}
          <img
            src={giftCardsHero}
            alt="Bright, freshly cleaned living room — a clean home given as a gift"
            width={1920}
            height={1080}
            className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
           loading="eager" fetchPriority="high"/>
          <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/85 via-brand-navy/70 to-brand-navy/90 pointer-events-none" />
          {/* Decorative blur orbs */}
          <div className="absolute top-10 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10" ref={heroRef}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-3 hover:rotate-0 transition-transform duration-500">
                <Gift className="w-10 h-10 text-accent" />
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white">
                House Cleaning <span className="text-accent">Gift Cards</span> for Edmonton and Calgary
              </h1>
              <p className="text-xl md:text-2xl text-white/85 mb-3 leading-relaxed">
                Any amount, emailed to them, backed by the same{" "}
                <strong className="text-white">100% Satisfaction Guarantee</strong> as every clean
              </p>
              <p className="text-lg text-white/90 mb-10">
                They pick the service and the date. The balance does not expire.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
                {[
                  { icon: Star, label: RATING_CLAIM },
                  { icon: Users, label: `${HOMES_CLEANED.alberta} Alberta homes cleaned` },
                  { icon: BadgeCheck, label: "Satisfaction Guaranteed" },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <badge.icon className="w-4 h-4 text-accent" />
                    <span className="text-white/90 text-sm font-medium">{badge.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-10 py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" asChild>
                  <a href={GIFT_CARD_PURCHASE_URL} target="_blank" rel="noopener noreferrer">
                    <Gift className="w-5 h-5 mr-2" />
                    BUY A GIFT CARD
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-10 py-6 h-auto font-semibold" asChild>
                  <Link to="/contact-us/?topic=gift-card">Ask a Question</Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-white/80">
                Purchased securely through our booking system · No contracts · Alberta
              </p>
            </div>
          </div>
        </section>

        {/* Gift Card Designs Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4" ref={designsRef}>
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">Personalize Your Gift</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Choose Your Gift Card Design</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Pick the design that fits the occasion.
                </p>
              </div>

              <div className="mb-12 px-12">
                <Carousel opts={{ align: "center", loop: true }} className="w-full">
                  <CarouselContent className="-ml-4">
                    {giftCardDesigns.map((design) => (
                      <CarouselItem key={design.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3">
                        <GiftCardDesignCard
                          design={design}
                          isSelected={selectedDesign === design.id}
                          onSelect={setSelectedDesign}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0" />
                  <CarouselNext className="right-0" />
                </Carousel>
              </div>

              <div className="text-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5" asChild>
                  <Link to={`/contact-us/?topic=gift-card&design=${selectedDesign}`}>
                    <Gift className="w-5 h-5 mr-2" />
                    Continue with {giftCardDesigns.find((d) => d.id === selectedDesign)?.name}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-brand-navy relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10" ref={howItWorksRef}>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-brand-gold font-semibold text-sm uppercase tracking-wider">Simple &amp; Easy</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-white">
                  Four steps to send a gift card
                </h2>
                <p className="text-lg text-white/90">
                  About two minutes, start to finish.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/10 mb-10">
                <div className="grid md:grid-cols-4 gap-8">
                  {howItWorksSteps.map((step) => (
                    <div key={step.step} className="text-center group" style={{ perspective: "1000px" }}>
                      <div className="transition-all duration-500 ease-out group-hover:-translate-y-2" style={{ transformStyle: "preserve-3d" }}>
                        <div className="w-14 h-14 bg-brand-gold/15 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform duration-500 group-hover:rotate-6">
                          <step.icon className="w-7 h-7 text-brand-gold" />
                        </div>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Step {step.step}</span>
                        <h4 className="font-semibold mt-1 mb-2 text-white">{step.title}</h4>
                        <p className="text-sm text-white/80 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <p className="text-white/90 leading-relaxed max-w-2xl mx-auto">
                  Fill in the amount and the recipient's details, and{" "}
                  <strong className="text-white">we email them a gift card they can redeem whenever they like.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Buying Guide Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4" ref={guideRef}>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">Buying Guide</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Gift card amounts and what they cover</h2>
                <p className="text-lg text-muted-foreground">
                  What each amount pays for in full, by home size, before 5% GST.
                </p>
                <p className="text-sm text-muted-foreground mt-3 italic">
                  The exact figure depends on bedrooms, bathrooms and add-ons; the recipient sees it before they book.
                </p>
              </div>

              <div className="space-y-4">
                {buyingGuide.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-5 bg-card rounded-xl p-5 border border-border/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                    style={{ perspective: "1000px" }}
                  >
                    <div className="w-20 h-14 bg-brand-navy/10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:rotate-3">
                      <span className="font-bold text-brand-navy text-lg">{item.amount}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Important Information Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4" ref={infoRef}>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">Good to Know</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Important Information</h2>
                <p className="text-lg text-muted-foreground">How the card is used, redeemed and covered.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <InfoCard
                  icon={Gift}
                  iconColor="text-accent"
                  title="How to Use"
                  items={[
                    { text: "Valid for any cleaning service in Alberta." },
                    { text: "Can be used for standard, deep, move-in/move-out, and post-construction cleaning" },
                  ]}
                />

                <InfoCard
                  icon={Clock}
                  iconColor="text-accent"
                  title="How to Redeem"
                  items={[
                    { text: "Book online or call us and give the gift card code" },
                    { text: "No expiry date. The balance stays on the card until it is used" },
                  ]}
                />

                <InfoCard
                  icon={Shield}
                  iconColor="text-muted-foreground"
                  title="If the clean costs more, or less"
                  items={[
                    { text: "If the clean costs more than the card, the difference is paid at checkout" },
                    { text: "If it costs less, the remaining balance stays on the card for the next visit" },
                  ]}
                />

                <InfoCard
                  icon={Shield}
                  iconColor="text-accent"
                  title="100% Satisfaction Guarantee"
                  variant="highlight"
                  items={[]}
                  footerText={`A clean paid for with a gift card is covered the same way as any other. If something was missed, the recipient tells us within ${POLICY.guaranteeWindowHours} hours and we come back and re-clean it at no additional charge.`}
                  footerLink={{ text: "Learn more about our guarantee", href: "/satisfaction-guarantee/" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-brand-navy relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10" ref={ctaRef}>
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Send a gift card today</h2>
              <p className="text-lg text-white/75 mb-8 leading-relaxed">
                Any amount, emailed straight away, no expiry.
              </p>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-10 py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" asChild>
                <a href={GIFT_CARD_PURCHASE_URL} target="_blank" rel="noopener noreferrer">
                  <Gift className="w-5 h-5 mr-2" />
                  BUY A GIFT CARD ONLINE
                </a>
              </Button>
              <p className="mt-8 text-white/80">
                Questions? Call us at{" "}
                <a href="tel:7809136565" className="text-brand-gold underline underline-offset-2 font-medium">(780) 913-6565</a>{" "}
                (Edmonton) or{" "}
                <a href="tel:4037681341" className="text-brand-gold underline underline-offset-2 font-medium">(403) 768-1341</a>{" "}
                (Calgary)
              </p>
            </div>
          </div>
        </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
