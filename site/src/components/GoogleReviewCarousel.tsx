import { useState, useEffect } from "react";
import { Star, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Review {
  name: string;
  initial: string;
  location: string;
  color: string;
  date: string;
  text: string;
}

interface GoogleReviewCarouselProps {
  reviews: Review[];
  rating: string;
  reviewCount: string;
  googleSearchUrl: string;
  accentColor?: string;
}

const GoogleLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-border min-w-[300px] md:min-w-[350px]">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${review.color} rounded-full flex items-center justify-center text-white font-bold`}>
          {review.initial}
        </div>
        <div>
          <p className="font-semibold">{review.name}</p>
          <p className="text-xs text-muted-foreground">{review.location}</p>
        </div>
      </div>
      <GoogleLogo className="w-5 h-5" />
    </div>
    <div className="flex items-center gap-2 mb-3">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{review.date}</span>
    </div>
    <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
      "{review.text}"
    </p>
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
      <span>Posted on Google</span>
    </div>
  </div>
);

export default function GoogleReviewCarousel({ 
  reviews, 
  rating, 
  reviewCount, 
  googleSearchUrl,
  accentColor = "text-primary"
}: GoogleReviewCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (reviews.length - 2));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);
  
  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % (reviews.length - 2));
  };
  
  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + (reviews.length - 2)) % (reviews.length - 2));
  };

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Google Reviews Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-3 mb-4">
            <GoogleLogo className="w-10 h-10" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">Google Reviews</h2>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-4xl font-bold">{rating}</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
          </div>
          <p className="text-muted-foreground">Based on {reviewCount} reviews</p>
          <a 
            href={googleSearchUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className={`${accentColor} hover:underline text-sm mt-2`}
          >
            See all reviews on Google →
          </a>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg hidden md:flex"
            onClick={prevSlide}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg hidden md:flex"
            onClick={nextSlide}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Reviews Slider */}
          <div className="overflow-hidden">
            <div 
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
            >
              {reviews.map((review, index) => (
                <div key={index} className="flex-shrink-0 w-full md:w-1/3">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: reviews.length - 2 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  currentIndex === index ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile: Show all reviews in scroll */}
        <div className="md:hidden mt-8 overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-4">
            {reviews.map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}