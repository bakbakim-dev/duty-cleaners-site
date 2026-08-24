import heroReviews from "@/assets/hero-reviews-testimonials.jpg";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Star, Quote, Shield, Heart, Phone, MapPin, Sparkles, CheckCircle2, MessageSquare, ThumbsUp, Award } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { GOOGLE_LISTINGS, openGoogleListing } from "@/lib/google-listings";
import { Helmet } from "react-helmet-async";


const ReviewCard = ({ review, index }: {review: typeof reviews[0];index: number;}) => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`opacity-0 ${isVisible ? "animate-fade-slide-up" : ""}`}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}>
      
      <div
        className="bg-white rounded-xl p-6 border border-border shadow-sm relative group"
        style={{ perspective: "1000px", transformStyle: "preserve-3d" }}>
        
        <div className="transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-xl group-hover:scale-[1.02]">
          <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/15 transition-transform duration-500 group-hover:rotate-12" />

          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-brand-navy flex items-center justify-center text-white font-bold text-sm shrink-0">
              {review.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-foreground">{review.name}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{review.location}</span>
                <span className="mx-1">·</span>
                <span>{review.date}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-0.5">
              {[...Array(review.rating)].map((_, i) =>
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified</span>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed text-sm">
            "{review.text}"
          </p>
        </div>
      </div>
    </div>);

};

const StatCard = ({ icon: Icon, value, label }: {icon: React.ElementType;value: string;label: string;}) =>
<div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
    <Icon className="w-8 h-8 text-accent mx-auto mb-3" />
    <p className="text-3xl font-bold text-white mb-1">{value}</p>
    <p className="text-white/90 text-sm">{label}</p>
  </div>;


const reviews = [
{
  name: "Sarah M.",
  location: "Edmonton",
  rating: 5,
  date: "February 2025",
  text: "I hired Duty Cleaners for my move-out cleaning and they did an incredible job. Got my full deposit back! They cleaned everything including the fridge, oven, and inside cabinets. Highly recommend!"
},
{
  name: "Rosaleen B.",
  location: "Edmonton",
  rating: 5,
  date: "January 2025",
  text: "After a major renovation, we needed post-construction cleaning. Two experienced cleaners did our 2100 sq ft home in 5.5 hours. Every surface was spotless. The online portal made it easy to communicate our needs."
},
{
  name: "Bob B.",
  location: "Calgary",
  rating: 5,
  date: "January 2025",
  text: "Vicky is awesome! She's friendly, courteous and excellent at her job. The whole team at Duty Cleaners is professional and efficient."
},
{
  name: "Mom S.",
  location: "Edmonton",
  rating: 5,
  date: "December 2024",
  text: "Called for same-day service and they delivered! The manager was helpful and the cleaners were very efficient. Deep cleaned within exact time. 5 stars for the whole team!"
},
{
  name: "Fidausi S.",
  location: "Calgary",
  rating: 5,
  date: "December 2024",
  text: "Amazing move-out cleaning service! The place was spotless and even got a compliment from the landlord. Super happy with their work."
},
{
  name: "BG B.",
  location: "Edmonton",
  rating: 5,
  date: "November 2024",
  text: "A great experience. Spotless house! Well beyond my expectations."
},
{
  name: "Janette T.",
  location: "Edmonton",
  rating: 5,
  date: "October 2024",
  text: "I use Duty Cleaners for all my move-in cleans and am always impressed by their thorough work and excellent communication."
},
{
  name: "Terry H.",
  location: "Edmonton",
  rating: 5,
  date: "August 2024",
  text: "The most professional cleaning service I have ever hired! From the arrival notices to the follow-up call, everything was perfect. They did a miraculous move-out cleaning. Will definitely use again."
}];


export default function Reviews() {
  // Title is owned by <Helmet> below. A useEffect that also set document.title
  // raced it with a *different* string ("Client Reviews" vs "Customer Reviews"),
  // so which one shipped depended on effect ordering.

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Customer Reviews | Duty Cleaners Edmonton & Calgary</title>
        <meta name="description" content="Five-star rated house cleaning in Edmonton and Calgary. Read what Alberta homeowners say about Duty Cleaners before you book." />
        <link rel="canonical" href="https://dutycleaners.ca/reviews/" />
        <meta property="og:title" content="Customer Reviews | Duty Cleaners Edmonton & Calgary" />
        <meta property="og:description" content="Five-star rated house cleaning in Edmonton and Calgary. Read what Alberta homeowners say about Duty Cleaners before you book." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/reviews/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Customer Reviews | Duty Cleaners Edmonton & Calgary" />
        <meta name="twitter:description" content="Five-star rated house cleaning in Edmonton and Calgary. Read what Alberta homeowners say about Duty Cleaners before you book." />
      </Helmet>
      <Navigation />
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Image */}
        <img
          src={heroReviews}
          alt="Clean modern home interior"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        {/* Navy gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/70 to-brand-navy/40" />
        {/* Decorative blur elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/10">
              <MessageSquare className="w-4 h-4 text-accent" />
              <span className="text-white/90 text-sm font-medium">Real Stories from Real Clients</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Client Testimonials
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Hear from homeowners across Alberta who trust Duty Cleaners to keep their spaces spotless.
            </p>

            <div className="flex items-center justify-center gap-2 mb-2">
              {[...Array(5)].map((_, i) =>
              <Star key={i} className="w-7 h-7 fill-yellow-400 text-yellow-400" />
              )}
              <span className="text-2xl font-bold text-white ml-2">Five-Star Rated</span>
            </div>
            <p className="text-white/90 text-sm">Verified Google reviews from Alberta homeowners</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
            <StatCard icon={Star} value="5★" label="Five-Star Rated" />
            <StatCard icon={ThumbsUp} value="5,000+" label="Homes Cleaned" />
            <StatCard icon={Award} value="100%" label="Satisfaction Rate" />
            <StatCard icon={Heart} value="2017" label="Serving Alberta Since" />
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-foreground text-sm font-medium">What the Community Says</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Stories from Our Community
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              At Duty Cleaners, we don't just clean houses — we build lasting relationships. Our clients in Alberta trust us to treat their homes like our own.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {reviews.map((review, index) =>
            <ReviewCard key={index} review={review} index={index} />
            )}
          </div>
        </div>
      </section>

      {/* Google Reviews Badge */}
      <section className="py-20 bg-brand-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl p-10 text-center border border-border shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
                <svg viewBox="0 0 24 24" className="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-foreground mb-2">Verified Google Reviews</h2>
              <div className="flex items-center justify-center gap-2 my-4">
                <span className="text-5xl font-bold text-foreground">4.9</span>
                <div className="flex flex-col items-start">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) =>
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                  <span className="text-muted-foreground text-xs mt-1">out of 5</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-2">Verified Google reviews</p>
              <p className="text-muted-foreground text-xs flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" />
                Powered by Google
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {(["edmonton", "calgary"] as const).map((key) => (
                  <a
                    key={key}
                    href={GOOGLE_LISTINGS[key].reviewsUrl}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                     onClick={(event) => openGoogleListing(event, GOOGLE_LISTINGS[key].reviewsUrl)}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 px-4 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    Verify on Google
                    <span className="capitalize text-muted-foreground">({key})</span>
                  </a>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Every quote above is checkable in one click on our Google Business Profiles.
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-brand-navy rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-56 h-56 bg-accent/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <Sparkles className="w-10 h-10 text-accent mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Join Our Happy Clients?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Experience the Duty Cleaners difference. Get your free quote today and see why hundreds of families trust us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:7809136565"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors shadow-lg">
                  
                  <Phone className="w-4 h-4" />
                  Edmonton: 780-913-6565
                </a>
                <a
                  href="tel:4037681341"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-brand-navy font-semibold rounded-lg hover:bg-white/90 transition-colors shadow-lg">
                  
                  <Phone className="w-4 h-4" />
                  Calgary: (403) 768-1341
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>);

}