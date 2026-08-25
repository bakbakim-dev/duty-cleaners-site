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
import giftCardsHero from "@/assets/gift-cards-hero.jpg";
import {
  Gift, Heart, PartyPopper, Sparkles, Clock, CreditCard,
  Send, Shield, Snowflake, Award, HeartHandshake, Home,
  Star, Phone, BadgeCheck, Users
} from "lucide-react";

const giftCardDesigns = [
  { id: "congratulations", name: "Congratulations", icon: PartyPopper, gradient: "from-orange-400 via-orange-500 to-amber-600", bgPattern: "bg-gradient-to-br", description: "Perfect for celebrating achievements and milestones" },
  { id: "thank-you", name: "Thank You", icon: Heart, gradient: "from-teal-500 via-teal-600 to-cyan-700", bgPattern: "bg-gradient-to-br", description: "Show your gratitude with a sparkling clean home" },
  { id: "happy-for-you", name: "Happy for You", icon: Sparkles, gradient: "from-teal-400 via-orange-400 to-amber-500", bgPattern: "bg-gradient-to-br", description: "Share joy and happiness with someone special" },
  { id: "happy-holidays", name: "Happy Holidays", icon: Snowflake, gradient: "from-cyan-400 via-teal-500 to-teal-700", bgPattern: "bg-gradient-to-br", description: "Spread holiday cheer with the gift of a clean home" },
  { id: "you-deserve-it", name: "You Deserve It", icon: Award, gradient: "from-amber-400 via-orange-500 to-orange-600", bgPattern: "bg-gradient-to-br", description: "Treat someone special to well-deserved relaxation" },
  { id: "happy-anniversary", name: "Happy Anniversary", icon: HeartHandshake, gradient: "from-rose-400 via-pink-500 to-fuchsia-600", bgPattern: "bg-gradient-to-br", description: "Celebrate years of love with a sparkling clean home" },
  { id: "new-home", name: "Housewarming", icon: Home, gradient: "from-emerald-400 via-teal-500 to-cyan-600", bgPattern: "bg-gradient-to-br", description: "Welcome them to their new home with a fresh start" },
];

// Gift cards are purchased through our BookingKoala storefront.
const GIFT_CARD_PURCHASE_URL = "https://dutycleaners.bookingkoala.com/gift-card";

const buyingGuide = [
  { amount: "$165", description: "Perfect for a one-bedroom apartment standard clean" },
  { amount: "$250", description: "Ideal for a two-bedroom home standard clean" },
  { amount: "$350", description: "Best for a full house deep clean or move-in/move-out" },
  { amount: "Custom", description: "Choose any amount that fits your budget" },
];

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
        <title>Cleaning Gift Cards | Give the Gift of a Sparkling Home | Duty Cleaners</title>
        <meta name="description" content="Give the perfect gift - a professional house cleaning gift card. 100% stress-free guarantee. Redeemable anytime in Edmonton & Calgary." />
        {/* Near-duplicate of /gift-card (the linked page) — consolidate signals there. */}
        <link rel="canonical" href="https://dutycleaners.ca/gift-card/" />
        <meta property="og:title" content="Cleaning Gift Cards | Give the Gift of a Sparkling Home | Duty Cleaners" />
        <meta property="og:description" content="Give the perfect gift - a professional house cleaning gift card. 100% stress-free guarantee. Redeemable anytime in Edmonton & Calgary." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/gift-cards/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cleaning Gift Cards | Give the Gift of a Sparkling Home | Duty Cleaners" />
        <meta name="twitter:description" content="Give the perfect gift - a professional house cleaning gift card. 100% stress-free guarantee. Redeemable anytime in Edmonton & Calgary." />
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
            alt=""
            aria-hidden="true"
            width={1920}
            height={1080}
            className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
          />
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
                Know Someone Who Deserves a{" "}
                <span className="text-accent">Sparkling Clean</span> Home?
              </h1>
              <p className="text-xl md:text-2xl text-white/85 mb-3 leading-relaxed">
                Give Them a Cleaning Gift Card Backed by Our{" "}
                <strong className="text-white">100% Stress-Free Guarantee</strong>
              </p>
              <p className="text-lg text-white/90 mb-10">
                So They Can Relax While We Take Care of Everything!
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
                {[
                  { icon: Star, label: "5-Star Rated" },
                  { icon: Users, label: "5,000+ Homes Cleaned" },
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
                  <Link to="/contact-us?topic=gift-card">Ask a Question</Link>
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
                  Select a beautiful design that matches the occasion and make it truly special
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
                  <Link to={`/contact?topic=gift-card&design=${selectedDesign}`}>
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
                  Give the Gift of a Sparkling Home
                </h2>
                <p className="text-lg text-white/90">
                  Four simple steps to make someone's day brighter
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
                  Simply fill in the amount, add the details of your loved one, and{" "}
                  <strong className="text-white">we'll take care of sending them a gift card they can redeem at any time!</strong>
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
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Not Sure About the Amount?</h2>
                <p className="text-lg text-muted-foreground">
                  Here's a handy guide to help you choose the perfect gift card value
                </p>
                <p className="text-sm text-muted-foreground mt-3 italic">
                  Please note: these are estimated amounts only and may vary based on the actual size and condition of the home.
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
                <p className="text-lg text-muted-foreground">Everything you need to know about our gift cards</p>
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
                    { text: "Book online or call us and mention your gift card code" },
                    { text: "Gift card balance applied manually during checkout" },
                    { text: "Redeem within 6 months to ensure your gift card remains valid" },
                  ]}
                />

                <InfoCard
                  icon={Shield}
                  iconColor="text-muted-foreground"
                  title="Important Notes"
                  items={[
                    { text: "Gift cards are non-refundable" },
                    { text: "If service exceeds gift card value, pay the difference" },
                    { text: "Cannot be combined with other promotions or discounts" },
                  ]}
                />

                <InfoCard
                  icon={Shield}
                  iconColor="text-accent"
                  title="100% Stress-Free Guarantee"
                  variant="highlight"
                  items={[]}
                  footerText="Every gift card cleaning is backed by our satisfaction guarantee. If the recipient isn't 100% happy, we'll re-clean for free—as long as we are informed within 24 hours after the service."
                  footerLink={{ text: "Learn more about our guarantee", href: "/satisfaction-guarantee" }}
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Give the Perfect Gift?</h2>
              <p className="text-lg text-white/75 mb-8 leading-relaxed">
                Make someone's day with the gift of a sparkling clean home
              </p>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-10 py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" asChild>
                <a href={GIFT_CARD_PURCHASE_URL} target="_blank" rel="noopener noreferrer">
                  <Gift className="w-5 h-5 mr-2" />
                  BUY A GIFT CARD ONLINE
                </a>
              </Button>
              <p className="mt-8 text-white/80">
                Questions? Call us at{" "}
                <a href="tel:7809136565" className="text-brand-gold hover:underline font-medium">780-913-6565</a>{" "}
                (Edmonton) or{" "}
                <a href="tel:4037681341" className="text-brand-gold hover:underline font-medium">(403) 768-1341</a>{" "}
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
