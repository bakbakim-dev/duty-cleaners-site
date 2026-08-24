import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users, Award, Clock, Sparkles, Phone, MapPin, DollarSign, Star, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import heroCleaningLadies from "@/assets/hero-cleaning-ladies.jpg";
import DutyCleanPromise from "@/components/DutyCleanPromise";
import { Helmet } from "react-helmet-async";
export default function AboutUs() {
  return <div className="min-h-screen">
      <Helmet>
        <title>About Duty Cleaners | Edmonton & Calgary House Cleaning</title>
        <meta name="description" content="Meet the team behind Duty Cleaners. Serving Alberta since 2017 with reference-checked, customer-rated cleaners in Edmonton and Calgary." />
        <link rel="canonical" href="https://dutycleaners.ca/about-us/" />
        <meta property="og:title" content="About Duty Cleaners | Edmonton & Calgary House Cleaning" />
        <meta property="og:description" content="Meet the team behind Duty Cleaners. Serving Alberta since 2017 with reference-checked, customer-rated cleaners in Edmonton and Calgary." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/about-us/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Duty Cleaners | Edmonton & Calgary House Cleaning" />
        <meta name="twitter:description" content="Meet the team behind Duty Cleaners. Serving Alberta since 2017 with reference-checked, customer-rated cleaners in Edmonton and Calgary." />
      </Helmet>
      <Navigation />
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <section className="relative bg-brand-navy py-20 overflow-hidden">
        <img
          src={heroCleaningLadies}
          alt="Professional Duty Cleaners team smiling in a clean home"
          width={1920}
          height={1280}
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/70 to-brand-navy/90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="display-serif text-4xl md:text-5xl mb-6 font-bold text-white lg:text-7xl">About Duty Cleaners</h1>
            <p className="text-xl md:text-2xl mb-8 text-white/85 font-semibold">
              Dedicated to Exceptional Cleaning and Customer Care Since 2017
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <a href="#quote">See My Instant Price</a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <a href="tel:7809136565">Call 780-913-6565</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-6">Our Story</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                At Duty Cleaners, we understand that your home is a reflection of you, and we’re here to keep it
                sparkling clean. Serving homes across Alberta, our team of highly skilled cleaning professionals is
                dedicated to providing top-notch house cleaning services tailored to your needs.
              </p>
              <p>
                Since 2017, we’ve been transforming homes across Alberta with our professional and reliable cleaning
                services. What started as a small family business has grown into a trusted name serving
                thousands of satisfied customers across the province.
              </p>
              <p>
                We offer customizable cleaning plans to fit your unique requirements, ensuring every corner of your home
                gets the attention it deserves. With our 100% satisfaction guarantee, you can trust that we'll exceed
                your expectations every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-4">Our Journey</h2>
          <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
            From a small family business to one of Alberta's most trusted cleaning teams.
          </p>
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-brand-gold/40 md:left-0 md:right-0 md:top-[7px] md:bottom-auto md:h-0.5 md:w-auto" aria-hidden="true" />
            <div className="grid gap-10 md:grid-cols-4 md:gap-6">
              {[
                { title: "Where we started", text: "A small family business with one simple promise: treat every home like our own." },
                { title: "4,000+ Edmonton homes", text: "Word of mouth made us one of Edmonton's most trusted cleaning teams." },
                { title: "Calgary, here we come", text: "The same vetted cleaners, transparent pricing, and guarantee — now in Calgary and surrounding communities." },
                { title: "Today", text: "Two cities, a strict 5-step vetting process, and the same promise on every single visit." },
              ].map((step, index) => (
                <div key={step.title} className="relative pl-10 md:pl-0 md:pt-10">
                  <span className="absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-brand-gold bg-white md:left-1/2 md:top-0 md:-translate-x-1/2" aria-hidden="true" />
                  <span className="text-sm font-bold text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-1 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <DutyCleanPromise />

      {/* What Makes Us Unique */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-12">What Makes Us Different</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Heart,
                iconWrap: "bg-primary/10",
                iconColor: "text-primary",
                title: "Peace of Mind",
                text: "We go beyond just cleaning—we bring peace of mind and comfort to every household we serve. Our focus on reliability and building trust allows clients to focus on what matters most.",
              },
              {
                icon: Shield,
                iconWrap: "bg-accent/10",
                iconColor: "text-accent",
                title: "Reference-Checked & Customer-Rated",
                text: "Every cleaner is reference-checked before working in a customer’s home — then gets rated by the customer after every single visit.",
              },
              {
                icon: Users,
                iconWrap: "bg-rose-600",
                iconColor: "text-secondary",
                title: "Vetted Professional Cleaners You Can Trust",
                text: "All our cleaners are thoroughly vetted to provide exceptional service, giving you peace of mind every time.",
              },
              {
                icon: Sparkles,
                iconWrap: "bg-primary/10",
                iconColor: "text-primary",
                title: "All Cleaning Supplies & Equipment Provided",
                text: "Our professional cleaners arrive fully equipped with premium, non-toxic products and top-tier equipment, so you don't have to worry about providing a thing.",
              },
              {
                icon: Clock,
                iconWrap: "bg-accent/10",
                iconColor: "text-accent",
                title: "Instant Pricing",
                text: "Skip the hassle of calling multiple cleaners for quotes. Get an instant quote and save time!",
              },
              {
                icon: Award,
                iconWrap: "bg-green-400",
                iconColor: "text-secondary",
                title: "100% Satisfaction Guarantee",
                text: "If you're not happy with our service, we’ll come back free of charge. Simply let us know within 24 hours after your cleaning, and we’ll make it right.",
              },
            ].map((card, index) => {
              const CardIcon = card.icon;
              return (
                <div
                  key={card.title}
                  className="relative bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow hover-gentle-shake"
                >
                  <span className="absolute right-6 top-6 text-sm font-bold text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className={`w-16 h-16 ${card.iconWrap} rounded-2xl flex items-center justify-center mb-4`}>
                    <CardIcon className={`w-8 h-8 ${card.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                  <p className="text-muted-foreground">{card.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="display-serif text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-8">
              At Duty Cleaners, what we find most fulfilling is the sense of accomplishment and joy that comes from
              knowing our work has a meaningful impact. It's incredibly rewarding to hear how a clean, refreshed space
              makes our clients feel more at ease and in control of their lives.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              The gratitude and relief we see in client feedback remind us why we do what we do. For us, it's not just
              about the physical act of cleaning but about building trust, creating moments of happiness, and knowing
              we've made a real difference in someone's day.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-navy">
        <div className="container mx-auto px-4 text-center">
          <h2 className="display-serif text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience the Duty Cleaners Difference?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied customers across Alberta. Get your free quote today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
              <a href="#quote">See My Instant Price</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/reviews">Read Our Reviews</Link>
            </Button>
          </div>
        </div>
      </section>


      <Footer />
    </div>;
}