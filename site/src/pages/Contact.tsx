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
import { ARRIVAL_WINDOWS, PAYMENT_TERMS, POLICY } from "@/data/policy";
import { formatPrice } from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { submitQuote } from "@/lib/quote-submit";
import { toast } from "sonner";
import { z } from "zod";
import { CITY_PROOF, SUPPORT_EMAIL, schemaAddressFor, BRANCH_IDENTITY, BRANCH_PROFILES, ORG_ID, RATING_CLAIM } from "@/data/proof";

const TITLE = "Contact Duty Cleaners | Edmonton & Calgary";
const DESCRIPTION = `Contact Duty Cleaners in Edmonton or Calgary. Call ${CITY_PROOF.edmonton.phone} or ${CITY_PROOF.calgary.phone}, Mon-Sat 8am-8pm and Sun 9am-3pm, or send the form.`;

const TRAVEL_FEE = formatPrice(travelFee("standard") ?? 0);
/* Post-construction carries its own, larger travel-fee row in bk-config. */
const POST_CONSTRUCTION_TRAVEL_FEE = formatPrice(travelFee("post-construction") ?? 0);

/**
 * The payment sequence, read verbatim from policy.ts.
 *
 * This page used to say "Booking takes no deposit and no card", which is half
 * right and half wrong: there is no deposit, but a card IS taken, and the day
 * before the visit a temporary hold goes on it. A customer who read "no card"
 * and then saw a pending amount in their banking app had been told the opposite
 * of what happens. Matched on wording rather than index so a reordering of
 * PAYMENT_TERMS cannot silently pick the wrong sentence.
 */
const paymentTerm = (pattern: RegExp) => PAYMENT_TERMS.find((term) => pattern.test(term)) ?? "";
const PAYMENT_SEQUENCE = [
  paymentTerm(/Nothing is charged when you book/),
  paymentTerm(/temporary hold/),
  paymentTerm(/charged once the clean is complete/),
]
  .filter(Boolean)
  .join(" ");

/** The two offices keep the same hours; stated once so the schema and the cards agree. */
const OPENING_HOURS = [
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
];

/**
 * The questions that decide whether someone needs to call at all. Each answer
 * is the schema text; `more` is the page that carries the full version.
 * Figures read from policy.ts and bk-config.
 */
const CONTACT_FAQS: { q: string; a: string; more: { to: string; label: string } }[] = [
  {
    q: "What is included in a clean?",
    a: "A standard clean covers dusting, floors, the kitchen surfaces and appliance exteriors, the bathrooms, and inside the microwave. A deep clean adds baseboards, doors, light switches, vent covers and ceiling fan blades within reach; a move-out clean adds inside the oven, fridge, cabinets and closets. On a standard or deep clean, inside the oven and fridge are add-ons.",
    more: { to: "/whats-included", label: "The full checklist, service by service" },
  },
  {
    q: "Do I need to do anything before the cleaners arrive?",
    a: "You do not need to clean first. Tell us how to get in, where to park, whether there are pets, and any rooms to skip. Running water is required, and the team brings every product and piece of equipment. Clear counters and floors get cleaned, and cluttered ones get worked around.",
    more: { to: "/prepare", label: "How to prepare" },
  },
  {
    q: "Can I buy a clean for someone else?",
    a: `Yes. Gift cards are sold in any amount with no maximum, they do not expire, and if a clean costs less than the card the balance stays on it for the next visit. If it costs more, the recipient pays the difference.`,
    more: { to: "/gift-card", label: "Gift cards" },
  },
  {
    q: "What if something was missed?",
    a: `Tell us within ${POLICY.guaranteeWindowHours} hours of the clean and we come back and re-clean it at no additional charge. Photos help but are not a condition.`,
    more: { to: "/satisfaction-guarantee", label: "The guarantee in full" },
  },
  {
    q: "Which areas do you serve?",
    a: `The Edmonton office covers Edmonton plus St. Albert, Sherwood Park, Spruce Grove, Leduc, Beaumont, Fort Saskatchewan, Stony Plain, Morinville and Devon. The Calgary office covers Calgary plus Airdrie, Cochrane, Okotoks, Chestermere, Strathmore, High River, Langdon, Crossfield and Diamond Valley. Inside city limits there is no trip fee; outside them a ${TRAVEL_FEE} travel fee is added per visit on a home clean, or ${POST_CONSTRUCTION_TRAVEL_FEE} on post-construction, shown on the quote before you book. For an address that is not listed, call the branch.`,
    more: { to: "/locations", label: "Every area we serve" },
  },
  {
    q: "Are you hiring?",
    a: "Duty Cleaners takes cleaner applications for both cities through the join-the-team page, not the contact form, which routes to booking. Cleaners work as independent contractors with their own vehicle and equipment.",
    more: { to: "/join-the-team", label: "Join the team" },
  },
];

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
  reviewCount,
  accentColor = "primary"
}: {
  city: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  linkTo: string;
  /** This branch's own Google review count; never the two added together. */
  reviewCount?: number | null;
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
          <span>{RATING_CLAIM}{reviewCount ? `, ${reviewCount} reviews` : ""}</span>
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
  // Office cleaning is the one commercial job quoted online (owner, 2026-09-10).
  const isOffice = topic === "office";
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
    service: isGiftCard ? "gift-card" : isAirbnb ? "airbnb" : isOffice ? "commercial" : "",
    message: isGiftCard
      ? `I'd like to buy a Duty Cleaners gift card${giftDesignLabel ? ` (${giftDesignLabel} design)` : ""}. Please send me the details.`
      : isAirbnb
        ? "I'd like a callback about Airbnb / short-term rental turnover cleaning."
        : isOffice
          ? "I'd like a quote for office cleaning."
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
        toast.error("We couldn't send that. Please call the Edmonton or Calgary office instead.");
        return;
      }

      toast.success("Message sent. It is with the office now.");
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
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="keywords" content="contact duty cleaners, cleaning services Edmonton, cleaning services Calgary, house cleaning contact" />
        <link rel="canonical" href="https://dutycleaners.ca/contact-us/" />
        {/* This page renders fully-authored NAP for both offices but carried no
            structured data at all. Both nodes use the same @id the rest of the
            site references, and every value reads from src/data/proof.ts so the
            markup can never disagree with the visible address or phone. Each
            branch carries a ContactPoint and its PostalAddress; the FAQ block
            further down is mirrored as FAQPage. */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              ...(["edmonton", "calgary"] as const).map((key) => {
                const office = CITY_PROOF[key];
                return {
                  "@type": "LocalBusiness",
                  "@id": `https://dutycleaners.ca/#${key}`,
                  name: BRANCH_IDENTITY[key].name,
                  url: BRANCH_IDENTITY[key].url,
                  parentOrganization: { "@id": ORG_ID },
                  sameAs: [...BRANCH_PROFILES[key]],
                  telephone: office.phoneE164,
                  email: SUPPORT_EMAIL,
                  // One authority (data/proof.ts) — the split-on-comma inline
                  // version carried no postalCode.
                  address: schemaAddressFor(key),
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "customer service",
                    telephone: office.phoneE164,
                    email: SUPPORT_EMAIL,
                    areaServed: { "@type": "City", name: office.city },
                    availableLanguage: "English",
                    hoursAvailable: OPENING_HOURS,
                  },
                  areaServed: { "@type": "City", name: office.city },
                  openingHoursSpecification: OPENING_HOURS,
                };
              }),
              {
                "@type": "FAQPage",
                mainEntity: CONTACT_FAQS.map((faq) => ({
                  "@type": "Question",
                  name: faq.q,
                  acceptedAnswer: { "@type": "Answer", text: faq.a },
                })),
              },
            ],
          })}
        </script>
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/contact-us/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
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
              <span>Edmonton and Calgary offices</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Contact Duty Cleaners in <span className="text-brand-gold">Edmonton and Calgary</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
              The fastest answer to most questions is the price itself, which takes about a minute
              to see. For anything else, call the office for your city during opening hours, or
              send a message with the form.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {/* This page once offered no way to book at all: two phone numbers
                  and a message form, under a line inviting the reader to book. */}
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
            <h2 className="text-3xl md:text-4xl font-bold mt-2">The Edmonton and Calgary offices</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Call the office for the city the home is in. Both branches are rated {RATING_CLAIM},
              each on its own Google listing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <OfficeCard
              city="Edmonton"
              phone="(780) 913-6565"
              email={SUPPORT_EMAIL}
              reviewCount={CITY_PROOF.edmonton.googleReviewCount}
              address={`${CITY_PROOF.edmonton.streetAddress}, Edmonton, AB ${CITY_PROOF.edmonton.postalCode}`}
              hours="Mon–Sat: 8:00am–8:00pm
Sun: 9:00am–3:00pm"
              linkTo="/"
            />
            <OfficeCard
              city="Calgary"
              phone="(403) 768-1341"
              email={SUPPORT_EMAIL}
              reviewCount={CITY_PROOF.calgary.googleReviewCount}
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
                {/* The page says the instant price is faster than the form, so
                    the price comes first and the form second. */}
                <div className="mb-8 rounded-2xl border-2 border-accent/30 bg-accent/10 p-6">
                  <p className="text-lg font-semibold text-foreground">
                    To book, or to see what a clean costs, skip the form.
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Answer a few questions about the home and the price is on screen in about a
                    minute, before GST. Nothing is charged when you book.
                  </p>
                  <Button size="lg" className="mt-4 bg-accent hover:bg-accent/90 text-white h-12 px-6" asChild>
                    <a href={quoteHrefFor(pathname)}>
                      <Calculator className="mr-2 w-5 h-5" />
                      See My Instant Price
                    </a>
                  </Button>
                </div>

                <div className="mb-8">
                  <span className="text-accent font-semibold text-sm uppercase tracking-wide">Send a Message</span>
                  <h2 className="text-3xl md:text-4xl font-bold mt-2">Send a message to either office</h2>
                  <p className="text-muted-foreground mt-3">
                    For questions the price cannot answer: an unusual home, a fixed inspection
                    date, a gift card. Leave a phone number and the office can call you back.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8 space-y-5">
                  {isGiftCard && (
                    <div className="rounded-xl border border-accent/30 bg-accent/10 p-4">
                      <p className="font-semibold text-foreground">
                        Gift card{giftDesignLabel ? ` — ${giftDesignLabel} design` : ""}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        We've noted your choice. Add your details and the office will contact you
                        with payment and delivery options.
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
                          <SelectItem value="commercial">Office Cleaning</SelectItem>
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
                    Before You Write
                  </h3>
                  <div className="space-y-5">
                    {/* The "Quick Response — within 24 hours" item that stood
                        here promised a reply time nothing in the repository
                        confirms (proof.ts RESPONSE_TIME_PROMISE is still
                        TODO-OWNER and is rendered nowhere), so it is gone rather
                        than replaced with another invented number. What the page
                        can honestly say is that most questions do not need a
                        reply at all. */}
                    <FeatureHighlight
                      icon={CheckCircle2}
                      title="The Price Without Asking"
                      description="The quote form answers the most common question on its own, in about a minute, before GST."
                    />
                    <FeatureHighlight
                      icon={Users}
                      title="One Email for Both Cities"
                      description={`Write to ${SUPPORT_EMAIL} for either the Edmonton or the Calgary office.`}
                    />
                    <FeatureHighlight
                      icon={Shield}
                      title="No Deposit, and No Charge at Booking"
                      description={PAYMENT_SEQUENCE}
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
                      <h3 className="text-xl font-bold">The Re-Clean Guarantee</h3>
                      <p className="text-sm text-muted-foreground">If something was missed</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    If something was missed, tell us within {POLICY.guaranteeWindowHours} hours of the
                    clean and we come back and re-clean it at no additional charge. Photos help but
                    are not required.
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
              gives you the figure faster than a phone call can, before 5% GST, with the pet charge,
              the home-type surcharge or the travel fee included where they apply. Call when the
              home is unusual, when you are working to a specific inspection date, or when you
              would rather talk it through.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-5">
              Two things speed up any booking call: the number of bedrooms and bathrooms, and
              whether the home has been professionally cleaned recently. Those two answers decide
              which service fits, and they usually settle whether the home needs the standard rate
              or the deep-clean rate. If you are not sure, describe the place and we will tell you
              the cheaper of the two that still does the job.
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
            {/* Rendered from CONTACT_FAQS, which also feeds the FAQPage markup
                in <head>, so the two cannot drift. */}
            <ul className="space-y-4 text-muted-foreground">
              {CONTACT_FAQS.map((faq) => (
                <li key={faq.q}>
                  <strong className="text-foreground">{faq.q}</strong> {faq.a}{" "}
                  <Link to={canonicalForPath(faq.more.to)} className="text-accent underline underline-offset-2">
                    {faq.more.label}
                  </Link>
                </li>
              ))}
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See your Edmonton or Calgary price before you book</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Prices are flat by home size, before GST, with no long-term contract, and nothing is
            charged until the clean is done. To check an address, see{" "}
            <Link to="/locations/" className="text-accent underline underline-offset-2">
              every area we serve
            </Link>
            , or{" "}
            <Link to="/reviews/" className="text-accent underline underline-offset-2">
              read the reviews
            </Link>{" "}
            from both cities first.
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
