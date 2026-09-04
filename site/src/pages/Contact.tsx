import { useLocation } from "react-router-dom";
import { Calculator } from "lucide-react";
import { quoteHrefFor } from "@/lib/quote-link";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, Mail, MapPin, Clock, CheckCircle2, MessageSquare, Sparkles, Heart, Shield, Star, Building2, Users, LucideIcon, Send } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { canonicalForPath } from "@/data/legacy-urls";
import { ARRIVAL_WINDOWS } from "@/data/policy";
import { submitQuote } from "@/lib/quote-submit";
import { toast } from "sonner";
import { z } from "zod";
import { CITY_PROOF, SUPPORT_EMAIL, schemaAddressFor, BRANCH_IDENTITY, BRANCH_PROFILES, ORG_ID } from "@/data/proof";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(1, "Phone is required").max(20, "Phone must be less than 20 characters").regex(/^[0-9\-()+ ]+$/, "Please enter a valid phone number"),
  city: z.string().min(1, "Please select a city"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message must be less than 1000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Contact info card component
const ContactInfoCard = ({ 
  icon: Icon, 
  label, 
  value, 
  href,
  index = 0
}: { 
  icon: LucideIcon; 
  label: string; 
  value: string; 
  href?: string;
  index?: number;
}) => (
  <div 
    className={`group bg-white rounded-xl border border-border p-5 transition-all duration-300 ease-out cursor-pointer hover:-translate-y-2 ${index % 2 === 0 ? 'hover:translate-x-0.5' : 'hover:-translate-x-0.5'} hover:border-primary hover:shadow-xl hover:shadow-primary/10`}
    style={{ transformStyle: 'preserve-3d' }}
  >
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
      <Icon className="w-6 h-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
    </div>
    <div className="font-semibold text-foreground mb-1 transition-transform duration-300 group-hover:translate-x-1">{label}</div>
    {href ? (
      <a href={href} className="text-primary hover:underline transition-transform duration-300 inline-block group-hover:translate-x-1">
        {value}
      </a>
    ) : (
      <div className="text-muted-foreground text-sm leading-relaxed transition-transform duration-300 group-hover:translate-x-1">{value}</div>
    )}
  </div>
);

// Office card component
const OfficeCard = ({ 
  city, 
  phone, 
  email, 
  address, 
  hours, 
  linkTo,
  accentColor = "primary"
}: { 
  city: string; 
  phone: string; 
  email: string; 
  address: string; 
  hours: string;
  linkTo: string;
  accentColor?: string;
}) => (
  <div 
    className="group bg-brand-navy text-white rounded-2xl border border-white/10 p-8 transition-all duration-300 ease-out hover:-translate-y-2 hover:border-accent/60 hover:shadow-2xl hover:shadow-black/30 relative overflow-hidden"
    style={{ transformStyle: 'preserve-3d' }}
  >
    <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

    <div className="flex items-center gap-3 mb-6 relative z-10">
      <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
        <Building2 className="w-7 h-7 text-accent transition-transform duration-300 group-hover:rotate-12" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white transition-transform duration-300 group-hover:translate-x-1">{city} Office</h2>
        <div className="flex items-center gap-1 text-sm text-white/90">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <span>4.9 on Google</span>
        </div>
      </div>
    </div>

    <div className="space-y-4 mb-6 relative z-10">
      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 transition-all duration-300 group-hover:bg-white/10">
        <Phone className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
        <div>
          <div className="text-xs text-white/90 uppercase tracking-wide font-medium">Phone</div>
          <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-white font-semibold hover:text-accent hover:underline">
            {phone}
          </a>
        </div>
      </div>

      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 transition-all duration-300 group-hover:bg-white/10">
        <Mail className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
        <div>
          <div className="text-xs text-white/90 uppercase tracking-wide font-medium">Email</div>
          <a href={`mailto:${email}`} className="text-white font-semibold hover:text-accent hover:underline">
            {email}
          </a>
        </div>
      </div>

      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 transition-all duration-300 group-hover:bg-white/10">
        <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
        <div>
          <div className="text-xs text-white/90 uppercase tracking-wide font-medium">Address</div>
          <div className="text-white text-sm">{address}</div>
        </div>
      </div>

      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 transition-all duration-300 group-hover:bg-white/10">
        <Clock className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
        <div>
          <div className="text-xs text-white/90 uppercase tracking-wide font-medium">Hours</div>
          <div className="text-white text-sm whitespace-pre-line">{hours}</div>
        </div>
      </div>
    </div>

    <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-base font-semibold transition-transform duration-300 group-hover:scale-[1.02] relative z-10">
      <Link to={linkTo}>
        <Sparkles className="mr-2 w-5 h-5" />
        Visit {city} Page
      </Link>
    </Button>
  </div>
);

// Feature highlight component
const FeatureHighlight = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: LucideIcon; 
  title: string; 
  description: string;
}) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-accent" />
    </div>
    <div>
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-white/90 text-sm">{description}</p>
    </div>
  </div>
);

const GIFT_CARD_DESIGN_LABELS: Record<string, string> = {
  classic: "Classic",
  elegant: "Elegant",
  festive: "Festive",
  birthday: "Birthday",
  thankyou: "Thank You",
  housewarming: "Housewarming",
};

export default function Contact() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  // Gift-card visitors arrive with their choice already made — carry it into
  // the form instead of making them retype it.
  const topic = searchParams.get("topic");
  const isGiftCard = topic === "gift-card";
  // Airbnb / short-term rental is quoted by callback — carry the request over
  // so the visitor doesn't retype what they already told us.
  const isAirbnb = topic === "airbnb";
  const topicCity = searchParams.get("city");
  const giftDesign = searchParams.get("design");
  const giftDesignLabel = giftDesign
    ? GIFT_CARD_DESIGN_LABELS[giftDesign] ?? giftDesign.replace(/-/g, " ")
    : null;

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    city: topicCity === "edmonton" || topicCity === "calgary" ? topicCity : "",
    service: isGiftCard ? "gift-card" : isAirbnb ? "airbnb" : "",
    message: isGiftCard
      ? `I'd like to buy a Duty Cleaners gift card${giftDesignLabel ? ` (${giftDesignLabel} design)` : ""}. Please send me the details.`
      : isAirbnb
        ? "I'd like a callback about Airbnb / short-term rental turnover cleaning."
        : "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof ContactFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    // Real submission through the same GHL relay the funnel uses — success is
    // only shown on a genuine 2xx, never on a timer.
    void (async () => {
      const outcome = await submitQuote({
        source: "contact-form",
        city: formData.city || "Unspecified",
        service: formData.service || "General enquiry",
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        page_url: window.location.href,
        submitted_at: new Date().toISOString(),
        notes: formData.message,
      } as Parameters<typeof submitQuote>[0]);

      setIsSubmitting(false);

      if (!outcome.ok) {
        toast.error("We couldn't send that. Please call us and we'll help right away.");
        return;
      }

      toast.success("Message sent! We'll get back to you within 24 hours.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        city: "",
        service: "",
        message: "",
      });
    })();
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Contact Duty Cleaners | Edmonton & Calgary Cleaning Services</title>
        <meta name="description" content="Contact Duty Cleaners for professional cleaning services in Alberta. Call (780) 913-6565 or (403) 768-1341. Available Mon-Sat 8am-8pm." />
        <meta name="keywords" content="contact duty cleaners, cleaning services Edmonton, cleaning services Calgary, house cleaning contact" />
        <link rel="canonical" href="https://dutycleaners.ca/contact-us/" />
        {/* This page renders fully-authored NAP for both offices but carried no
            structured data at all. Both nodes use the same @id the rest of the
            site references, and every value reads from src/data/proof.ts so the
            markup can never disagree with the visible address or phone. */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": (["edmonton", "calgary"] as const).map((key) => {
              const office = CITY_PROOF[key];
              return {
                "@type": "LocalBusiness",
                "@id": `https://dutycleaners.ca/#${key}`,
                name: BRANCH_IDENTITY[key as "edmonton" | "calgary"].name,
                url: BRANCH_IDENTITY[key as "edmonton" | "calgary"].url,
                parentOrganization: { "@id": ORG_ID },
                sameAs: [...BRANCH_PROFILES[key as "edmonton" | "calgary"]],
                telephone: office.phoneE164,
                email: SUPPORT_EMAIL,
                // One authority (data/proof.ts) — the split-on-comma inline
                // version carried no postalCode.
                address: schemaAddressFor(
                  office.city.toLowerCase() as "edmonton" | "calgary",
                ),
                areaServed: { "@type": "City", name: office.city },
                openingHoursSpecification: [
                  {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    opens: "08:00",
                    closes: "20:00",
                  },
                  {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: "Sunday",
                    opens: "09:00",
                    closes: "15:00",
                  },
                ],
              };
            }),
          })}
        </script>
        <meta property="og:title" content="Contact Duty Cleaners | Edmonton & Calgary Cleaning Services" />
        <meta property="og:description" content="Contact Duty Cleaners for professional cleaning services in Alberta. Call (780) 913-6565 or (403) 768-1341. Available Mon-Sat 8am-8pm." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/contact-us/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Duty Cleaners | Edmonton & Calgary Cleaning Services" />
        <meta name="twitter:description" content="Contact Duty Cleaners for professional cleaning services in Alberta. Call (780) 913-6565 or (403) 768-1341. Available Mon-Sat 8am-8pm." />
      </Helmet>

      <Navigation />
      <main id="main-content" tabIndex={-1}>

      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero Section - Dark Navy */}
      <section className="relative bg-brand-navy text-white overflow-hidden py-16 md:py-20">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm mb-6">
              <MessageSquare className="w-4 h-4 text-accent" />
              <span>We'd Love to Hear From You</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Get In <span className="text-brand-gold">Touch</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Ready to book? See your price and pick a time in about a minute. If you would rather
              ask something first, call either office or send the form below and we reply within 24 hours.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {/* The line above says "Ready to book?" and this page had no way to
                  book — two phone numbers and a 24-hour inbox. */}
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white h-12 px-6" asChild>
                <a href={quoteHrefFor(pathname)}>
                  <Calculator className="mr-2 w-5 h-5" />
                  See My Instant Price
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-6" asChild>
                <a href="tel:7809136565">
                  <Phone className="mr-2 w-5 h-5" />
                  Call Edmonton
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-6" asChild>
                <a href="tel:4037681341">
                  <Phone className="mr-2 w-5 h-5" />
                  Call Calgary
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Office Cards Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent font-semibold text-sm uppercase tracking-wide">Our Locations</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Two Offices Serving Alberta</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Conveniently located to serve homes and businesses across Alberta.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <OfficeCard
              city="Edmonton"
              phone="(780) 913-6565"
              email="Support@dutycleaners.ca"
              address={`${CITY_PROOF.edmonton.streetAddress}, Edmonton, AB ${CITY_PROOF.edmonton.postalCode}`}
              hours="Mon–Sat: 8:00am–8:00pm
Sun: 9:00am–3:00pm"
              linkTo="/"
            />
            <OfficeCard
              city="Calgary"
              phone="(403) 768-1341"
              email="Support@dutycleaners.ca"
              address={`${CITY_PROOF.calgary.streetAddress}, Calgary, AB ${CITY_PROOF.calgary.postalCode}`}
              hours="Mon–Sat: 8:00am–8:00pm
Sun: 9:00am–3:00pm"
              linkTo={canonicalForPath("/calgary")}
            />
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Left Column - Form */}
              <div className="lg:col-span-3">
                <div className="mb-8">
                  <span className="text-accent font-semibold text-sm uppercase tracking-wide">Send a Message</span>
                  <h2 className="text-3xl md:text-4xl font-bold mt-2">We're Here to Help</h2>
                  <p className="text-muted-foreground mt-3">
                    Have a question or need help with a booking? Send us a message and we'll get back to you within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8 space-y-5">
                  {isGiftCard && (
                    <div className="rounded-xl border border-accent/30 bg-accent/10 p-4">
                      <p className="font-semibold text-foreground">
                        Gift card{giftDesignLabel ? ` — ${giftDesignLabel} design` : ""}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        We've noted your choice. Add your details below and we'll send payment and
                        delivery options right away.
                      </p>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Every field marked <span className="text-accent">*</span> is required.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Name<span className="text-accent" aria-hidden="true"> *</span></Label>
                      <Input
                        id="contact-name"
                        autoComplete="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">Phone<span className="text-accent" aria-hidden="true"> *</span></Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="(780) 555-1234"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email<span className="text-accent" aria-hidden="true"> *</span></Label>
                    <Input
                      id="contact-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>City<span className="text-accent" aria-hidden="true"> *</span></Label>
                      <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                        <SelectTrigger aria-label="City" className={errors.city ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="edmonton">Edmonton</SelectItem>
                          <SelectItem value="calgary">Calgary</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Service<span className="text-accent" aria-hidden="true"> *</span></Label>
                      <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                        <SelectTrigger aria-label="Service" className={errors.service ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Cleaning</SelectItem>
                          <SelectItem value="deep">Deep Cleaning</SelectItem>
                          <SelectItem value="move">Move-In/Move-Out Cleaning</SelectItem>
                          <SelectItem value="post-construction">Post-Construction Cleaning</SelectItem>
                          <SelectItem value="airbnb">Airbnb Cleaning</SelectItem>
                          <SelectItem value="gift-card">Gift Card</SelectItem>
                          <SelectItem value="commercial">Office & Commercial Cleaning</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.service && <p className="text-sm text-destructive">{errors.service}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Message<span className="text-accent" aria-hidden="true"> *</span></Label>
                    <Textarea
                      id="contact-message"
                      placeholder="How can we help?"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={errors.message ? "border-destructive" : ""}
                    />
                    {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-base font-semibold">
                    <Send className="mr-2 w-5 h-5" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>

              {/* Right Column - Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-brand-navy text-white rounded-2xl p-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-accent" />
                    Why Contact Us?
                  </h3>
                  <div className="space-y-5">
                    <FeatureHighlight 
                      icon={CheckCircle2} 
                      title="Quick Response" 
                      description="We respond to all inquiries within 24 hours, often much sooner."
                    />
                    <FeatureHighlight 
                      icon={Users} 
                      title="One Call, Either City" 
                      description="Edmonton and Calgary are answered by the same team, Mon-Sat 8am-8pm and Sun 9am-3pm."
                    />
                    <FeatureHighlight 
                      icon={Shield} 
                      title="Nothing to Pay Up Front" 
                      description="Booking takes no deposit and no card. You pay after the clean is done."
                    />
                  </div>
                </div>

                {/* Satisfaction Guarantee */}
                <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-8 border-2 border-accent/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">100% Satisfaction</h3>
                      <p className="text-sm text-muted-foreground">Guaranteed</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We stand behind the quality of our staff. If you're not 100% satisfied with your cleaning, we'll come back and re-clean it at no additional charge, as long as we’re informed within 24 hours after the cleaning.
                  </p>
                </div>

                {/* Quick Contact */}
                <div className="grid grid-cols-2 gap-4">
                  <ContactInfoCard
                    icon={Phone}
                    label="Edmonton"
                    value="(780) 913-6565"
                    href="tel:7809136565"
                    index={0}
                  />
                  <ContactInfoCard
                    icon={Phone}
                    label="Calgary"
                    value="(403) 768-1341"
                    href="tel:4037681341"
                    index={1}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*
        At 288 words of main content this was the thinnest page on the site —
        a phone number and a form, with none of the information that decides
        whether someone needs to call at all. The three link destinations below
        (/prepare, /gift-card, /join-the-team) were also the site's only pages
        with zero contextual in-body links anywhere: footer-linked, so
        crawlable, but nothing editorial pointed at them.
      */}
      <section className="py-16 md:py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
              Before you call
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-5">
              We answer Monday to Saturday, 8:00 AM to 8:00 PM, and Sunday 9:00 AM to 3:00 PM. If
              you already know your home's size and roughly what you want done, the instant quote
              will give you a real number faster than we can on the phone — the price you see is
              the price, before 5% GST. Call when the home is unusual, when you are working to a
              specific inspection date, or when you would simply rather talk it through.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-5">
              Two things speed up any booking call: the number of bedrooms and bathrooms, and
              whether the home has been professionally cleaned recently. Those two answers decide
              which service you actually need, and getting it right up front is usually the
              difference between the standard rate and the deep-clean rate. If you are not sure,
              describe the place and we will tell you which is the cheaper honest answer.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We schedule to an arrival window rather than an exact time, so one job running long
              does not push your whole day. The windows are{" "}
              {ARRIVAL_WINDOWS.join(", ")}, and you do not need to be home — most customers leave
              a key, a lockbox code or smart-lock access, and we lock up when we finish.
            </p>

            <h3 className="text-xl font-bold text-foreground mb-4">
              Questions we can answer without a phone call
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <strong className="text-foreground">What's actually included?</strong>{" "}
                <Link to={canonicalForPath("/whats-included")} className="text-accent hover:underline">
                  The full scope list
                </Link>{" "}
                covers every service and, just as usefully, what falls outside it.
              </li>
              <li>
                <strong className="text-foreground">Do I need to do anything first?</strong>{" "}
                <Link to={canonicalForPath("/prepare")} className="text-accent hover:underline">
                  How to prepare
                </Link>{" "}
                is short — mostly it is about access, pets, and the few things that stop a team
                reaching a surface at all.
              </li>
              <li>
                <strong className="text-foreground">Can I buy this for someone else?</strong>{" "}
                <Link to={canonicalForPath("/gift-card")} className="text-accent hover:underline">
                  Gift cards
                </Link>{" "}
                have no expiry date and no maximum value, and the balance carries over if a
                clean costs less than the card.
              </li>
              <li>
                <strong className="text-foreground">What if something was missed?</strong> Tell us
                within 24 hours and we return and re-clean it free —{" "}
                <Link to={canonicalForPath("/satisfaction-guarantee")} className="text-accent hover:underline">
                  the guarantee
                </Link>{" "}
                sets out exactly what that covers.
              </li>
              <li>
                <strong className="text-foreground">Are you hiring?</strong> Often, in both cities.{" "}
                <Link to={canonicalForPath("/join-the-team")} className="text-accent hover:underline">
                  Join the team
                </Link>{" "}
                is the place to apply — please don't use the form above for job enquiries, as it
                routes to booking.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-brand-navy text-white py-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Sparkles className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for a Spotless Home?</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Book your cleaning today and experience the Duty Cleaners difference. No contracts, no hidden fees.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white h-12 px-8" asChild>
              <Link to="/pricing/">
                View Edmonton Pricing
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-8" asChild>
              <Link to="/calgary/pricing/">
                View Calgary Pricing
              </Link>
            </Button>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
