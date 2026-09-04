import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Briefcase, 
  Car, 
  Shield, 
  FileCheck,
  Sparkles,
  Heart,
  ArrowRight,
  Phone,
  Star,
  HelpCircle,
  Mail
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { submitQuote } from "@/lib/quote-submit";
import { toast } from "sonner";
import { z } from "zod";
import heroCleanersSmiling from "@/assets/hero-cleaners-smiling.webp";
import { CITY_PROOF, CLEANER_JOB_POSTING } from "@/data/proof";

const applicationSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().trim().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  phone: z.string().trim().min(1, "Phone is required").max(20, "Phone must be less than 20 characters").regex(/^[0-9\-()+ ]+$/, "Please enter a valid phone number"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  location: z.string().min(1, "Please select a location"),
  experience: z.string().min(1, "Please select your experience level"),
  ownEquipment: z.string().min(1, "Please answer this question"),
  currentClients: z.string().min(1, "Please answer this question"),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

// Benefits data
const benefits = [
  {
    icon: Users,
    title: "Supportive Team",
    description: "Become part of a team that truly values and supports you."
  },
  {
    icon: DollarSign,
    title: "Great Pay",
    description: "Earn competitive pay based on jobs completed."
  },
  {
    icon: Calendar,
    title: "Flexible Schedule",
    description: "Work when you want with a flexible schedule that fits your life."
  },
  {
    icon: MapPin,
    title: "Choose Your Areas",
    description: "Get jobs in the areas you choose to work in."
  },
  {
    icon: Briefcase,
    title: "Regular Bookings",
    description: "Regular bookings at the same time and location every week."
  },
  {
    icon: Clock,
    title: "No Night Shifts",
    description: "Option to take weekends off, and no night shifts."
  }
];

// Requirements data
const requirements = [
  {
    icon: FileCheck,
    title: "BN Registered",
    // "BN" was unexplained, and it is the requirement that tells an applicant
    // this is contract work rather than employment.
    description: "Cleaners work as independent contractors, so you need a CRA Business Number. Registering for one takes about 15 minutes and is free."
  },
  {
    icon: Car,
    title: "Your Own Vehicle",
    description: "Must have reliable transportation to get to job sites."
  },
  {
    icon: FileCheck,
    title: "Driver's License",
    description: "Valid driver's license required."
  },
  {
    icon: Shield,
    title: "Reference Checked",
    description: "Must provide checkable references."
  },
  {
    icon: CheckCircle2,
    title: "Professional Experience",
    description: "Have professional house/domestic cleaning experience."
  },
  {
    icon: Briefcase,
    title: "Own Equipment",
    description: "Provide your own equipment and cleaning supplies."
  }
];

// FAQ data
const faqs = [
  {
    value: "pay",
    question: "What does the position pay?",
    answer: "Pay is per job completed rather than per hour, so what you earn in a pay period depends on how many jobs you take and how efficiently you work. Ask for the current per-job rates for your city when we call you — we will give you the actual numbers before you commit to anything."
  },
  {
    value: "hours",
    question: "What are the hours?",
    answer: "Most cleaning shifts run between 9:00 AM and 5:00 PM, Monday to Sunday. (Our customer service hours are Monday to Saturday 8:00 AM to 8:00 PM and Sunday 9:00 AM to 3:00 PM.). You can choose the days and hours that work best for you."
  },
  {
    value: "transportation",
    question: "Do I need to have private reliable transportation?",
    answer: "Yes, you need your own vehicle to get to your jobs. Drop-offs by someone else are not allowed."
  },
  {
    value: "qualifications",
    question: "What qualifications are required for this position?",
    answer: "• You must have paid experience as a cleaner\n• You must be authorized to work in Canada\n• You must speak English to a conversational level\n• You must be responsible and trustworthy\n• You must have internet access\n• You must provide checkable references"
  },
  {
    value: "next-steps",
    question: "I already applied, now what?",
    answer: "We review every application and contact qualified applicants within 24-48 hours — the same window quoted above. If two full business days have passed and you have heard nothing, call us at (780) 913-6565 and we will check on it."
  }
];

// Benefit Card Component
function BenefitCard({ benefit, index }: { benefit: typeof benefits[0]; index: number }) {
  const Icon = benefit.icon;
  const isAccent = index % 2 === 1;
  
  return (
    <div 
      className="group bg-white rounded-2xl shadow-lg p-6 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl border border-primary/10"
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
        isAccent ? 'bg-accent/10' : 'bg-primary/10'
      }`}>
        <Icon className={`w-7 h-7 ${isAccent ? 'text-accent' : 'text-primary'}`} />
      </div>
      <h3 className="text-lg font-bold mb-2 text-foreground">{benefit.title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
    </div>
  );
}

// Requirement Card Component
function RequirementCard({ requirement, index }: { requirement: typeof requirements[0]; index: number }) {
  const Icon = requirement.icon;
  
  return (
    <div 
      className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-500 ease-out hover:-translate-y-2 hover:bg-white/15"
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
        <Icon className="w-6 h-6 text-accent" />
      </div>
      <h3 className="text-lg font-bold mb-2 text-white">{requirement.title}</h3>
      <p className="text-white/90 text-sm leading-relaxed">{requirement.description}</p>
    </div>
  );
}

export default function JoinTheTeam() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState<ApplicationFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    location: "",
    experience: "",
    ownEquipment: "",
    currentClients: "",
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToForm = () => {
    document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = applicationSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ApplicationFormData, string>> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof ApplicationFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setIsSubmitting(true);

    // Real submission through the same relay the contact form uses — an
    // applicant is never told "submitted" unless the relay accepted it.
    void (async () => {
      const outcome = await submitQuote({
        source: "careers-application",
        city: formData.location || "Unspecified",
        service: "Cleaner application",
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        page_url: window.location.href,
        submitted_at: new Date().toISOString(),
        notes: [
          `Experience: ${formData.experience || "n/a"}`,
          `Own equipment: ${formData.ownEquipment || "n/a"}`,
          `Current clients: ${formData.currentClients || "n/a"}`,
        ].join(" | "),
      } as Parameters<typeof submitQuote>[0]);

      setIsSubmitting(false);

      if (!outcome.ok) {
        toast.error("We couldn't send that. Please email support@dutycleaners.ca and we'll pick it up.");
        return;
      }

      toast.success("Application submitted! We'll contact you within 24-48 hours.");
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        location: "",
        experience: "",
        ownEquipment: "",
        currentClients: "",
      });
    })();
  };

  return (
    <>
      <Helmet>
        <title>Cleaning Jobs Edmonton & Calgary | Duty Cleaners Careers</title>
        <meta
          name="description"
          content="Join the Duty Cleaners team. Flexible schedules, competitive pay and consistent work. Cleaning positions in Edmonton and Calgary."
        />
        <link rel="canonical" href="https://dutycleaners.ca/join-the-team/" />
        <meta property="og:title" content="Cleaning Jobs Edmonton & Calgary | Duty Cleaners Careers" />
        <meta property="og:description" content="Join the Duty Cleaners team. Flexible schedules, competitive pay and consistent work. Cleaning positions in Edmonton and Calgary." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/join-the-team/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cleaning Jobs Edmonton & Calgary | Duty Cleaners Careers" />
        <meta name="twitter:description" content="Join the Duty Cleaners team. Flexible schedules, competitive pay and consistent work. Cleaning positions in Edmonton and Calgary." />
        {/* Mirrors the FAQ accordion rendered on this page. */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          })}
        </script>
        {/* JobPosting is emitted only once the owner sets a real datePosted in
            src/data/proof.ts. Google demotes postings with stale or missing
            dates, so shipping a hardcoded one would be worse than none. */}
        {CLEANER_JOB_POSTING.datePosted && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JobPosting",
              title: "House Cleaner",
              description:
                "Duty Cleaners is hiring experienced house cleaners in Edmonton and Calgary. Regular bookings at the same time and location each week, flexible scheduling, no night shifts, and the option to take weekends off.",
              datePosted: CLEANER_JOB_POSTING.datePosted,
              ...(CLEANER_JOB_POSTING.validThrough
                ? { validThrough: CLEANER_JOB_POSTING.validThrough }
                : {}),
              employmentType: CLEANER_JOB_POSTING.employmentType,
              hiringOrganization: {
                "@type": "Organization",
                name: "Duty Cleaners",
                sameAs: "https://dutycleaners.ca/",
              },
              jobLocation: (["edmonton", "calgary"] as const).map((key) => ({
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: CITY_PROOF[key].city,
                  addressRegion: "AB",
                  addressCountry: "CA",
                },
              })),
              directApply: true,
            })}
          </script>
        )}
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main id="main-content" tabIndex={-1}>
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero Section */}
        <section className="relative py-24 bg-brand-navy overflow-hidden">
          {/* Background Image */}
          <img width={1280} height={720}
            src={heroCleanersSmiling}
            alt="Smiling professional cleaners"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
           loading="eager" fetchPriority="high"/>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/85 via-brand-navy/75 to-brand-navy/90" />
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Heart className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">Join Our Family</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Become Part of the <span className="text-accent">Duty Cleaners</span> Family
              </h1>
              
              <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-10">
                Help Us Keep Spaces Spotless – Join Our Team!
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full border border-white/20">
                  <DollarSign className="w-5 h-5 text-accent" />
                  <span className="font-medium text-white">Competitive Pay</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full border border-white/20">
                  <Calendar className="w-5 h-5 text-accent" />
                  <span className="font-medium text-white">Flexible Hours</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full border border-white/20">
                  <Star className="w-5 h-5 text-accent" />
                  <span className="font-medium text-white">Great Team</span>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="text-lg px-8 bg-accent text-accent-foreground hover:bg-accent/90 group"
                onClick={scrollToForm}
              >
                Apply Today
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-medium">Why Choose Us?</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What You Get</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join a team that values your time, rewards your work, and supports your growth.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <BenefitCard key={benefit.title} benefit={benefit} index={index} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" onClick={scrollToForm} className="group">
                Take Me to the Application
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-20 bg-brand-navy relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">Job Requirements</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What You Need</h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                We require you to have the following criteria in order to be eligible to work at Duty Cleaners.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {requirements.map((requirement, index) => (
                <RequirementCard key={requirement.title} requirement={requirement} index={index} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button 
                size="lg" 
                onClick={scrollToForm}
                className="bg-accent hover:bg-accent/90 text-accent-foreground group"
              >
                I'm Ready to Apply
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works — Onboarding Steps */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
                <ArrowRight className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-medium">How It Works</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">From Application to Your First Clean</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Four simple steps — most applicants hear back within 24-48 hours.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                {
                  icon: FileCheck,
                  title: "Apply online",
                  text: "Fill out the application below — it takes about 5 minutes.",
                  preview: (
                    <div className="space-y-2">
                      <div className="h-2.5 w-3/4 rounded-full bg-border" />
                      <div className="h-2.5 w-full rounded-full bg-border" />
                      <div className="h-7 w-24 rounded-md bg-accent/80" />
                    </div>
                  ),
                },
                {
                  icon: CheckCircle2,
                  title: "We review",
                  text: "Our team reviews every application and contacts qualified applicants within 24-48 hours.",
                  preview: (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-success" /><div className="h-2.5 w-2/3 rounded-full bg-border" /></div>
                      <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-success" /><div className="h-2.5 w-1/2 rounded-full bg-border" /></div>
                      <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-accent" /><div className="h-2.5 w-3/5 rounded-full bg-border" /></div>
                    </div>
                  ),
                },
                {
                  icon: Shield,
                  title: "Meet & vet",
                  text: "A quick interview and reference check — the same bar every Duty Cleaners pro clears.",
                  preview: (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-2.5 w-24 rounded-full bg-border" />
                        <div className="h-2.5 w-16 rounded-full bg-border" />
                      </div>
                    </div>
                  ),
                },
                {
                  icon: Calendar,
                  title: "Start cleaning",
                  text: "Choose the areas you serve and set a schedule that fits your life.",
                  preview: (
                    <div className="grid grid-cols-3 gap-1.5">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className={`h-6 rounded ${i === 1 || i === 4 ? "bg-accent/70" : "bg-border"}`} />
                      ))}
                    </div>
                  ),
                },
              ].map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="group flex flex-col rounded-xl border border-border bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/40"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                        <StepIcon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                      </div>
                      <span className="text-sm font-bold text-brand-gold">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{step.text}</p>
                    <div className="mt-auto rounded-lg bg-secondary/60 p-4" aria-hidden="true">
                      {step.preview}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
                  <HelpCircle className="w-4 h-4 text-primary" />
                  <span className="text-primary text-sm font-medium">FAQ</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Your Questions Answered</h2>
                <p className="text-xl text-muted-foreground">
                  Have questions? Here are some answers to people's most common questions.
                </p>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq) => (
                  <AccordionItem 
                    key={faq.value} 
                    value={faq.value} 
                    className="bg-white border border-primary/10 rounded-xl px-6 shadow-sm"
                  >
                    <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground whitespace-pre-line">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="text-center mt-10">
                <Button size="lg" onClick={scrollToForm} className="group">
                  I'm Ready to Apply
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form Section */}
        <section id="application-form" className="py-20 bg-brand-navy relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  <FileCheck className="w-4 h-4 text-accent" />
                  <span className="text-white/90 text-sm font-medium">Application</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Apply Below</h2>
                <p className="text-xl text-white/90">
                  Simply fill out the application below and we'll contact you within 24-48 hours if you're qualified.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-white/20">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-foreground font-medium">First Name *</Label>
                      <Input
                        id="firstName"
                        autoComplete="given-name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className={`bg-secondary/30 border-primary/20 focus:border-primary ${errors.firstName ? "border-destructive" : ""}`}
                      />
                      {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-foreground font-medium">Last Name *</Label>
                      <Input
                        id="lastName"
                        autoComplete="family-name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className={`bg-secondary/30 border-primary/20 focus:border-primary ${errors.lastName ? "border-destructive" : ""}`}
                      />
                      {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-foreground font-medium">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`bg-secondary/30 border-primary/20 focus:border-primary ${errors.phone ? "border-destructive" : ""}`}
                      />
                      {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground font-medium">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`bg-secondary/30 border-primary/20 focus:border-primary ${errors.email ? "border-destructive" : ""}`}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-foreground font-medium">Which Location are you applying for? *</Label>
                    <Select
                      value={formData.location}
                      onValueChange={(value) => setFormData({ ...formData, location: value })}
                    >
                      <SelectTrigger id="location" className={`bg-secondary/30 border-primary/20 ${errors.location ? "border-destructive" : ""}`}>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="edmonton">Edmonton</SelectItem>
                        <SelectItem value="calgary">Calgary</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-foreground font-medium">How long have you been working as a professional cleaner? *</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => setFormData({ ...formData, experience: value })}
                    >
                      <SelectTrigger id="experience" className={`bg-secondary/30 border-primary/20 ${errors.experience ? "border-destructive" : ""}`}>
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-experience">No Experience willing to be trained</SelectItem>
                        <SelectItem value="1-year">1 year and under</SelectItem>
                        <SelectItem value="2-years">2 years</SelectItem>
                        <SelectItem value="3-years">3 years</SelectItem>
                        <SelectItem value="4-years">4 years and above</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.experience && <p className="text-sm text-destructive">{errors.experience}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownEquipment" className="text-foreground font-medium">Will you be able to provide your own equipment and cleaning supplies? *</Label>
                    <Select
                      value={formData.ownEquipment}
                      onValueChange={(value) => setFormData({ ...formData, ownEquipment: value })}
                    >
                      <SelectTrigger id="ownEquipment" className={`bg-secondary/30 border-primary/20 ${errors.ownEquipment ? "border-destructive" : ""}`}>
                        <SelectValue placeholder="Select answer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.ownEquipment && <p className="text-sm text-destructive">{errors.ownEquipment}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentClients" className="text-foreground font-medium">How many clients do you currently clean for? *</Label>
                    <Select
                      value={formData.currentClients}
                      onValueChange={(value) => setFormData({ ...formData, currentClients: value })}
                    >
                      <SelectTrigger id="currentClients" className={`bg-secondary/30 border-primary/20 ${errors.currentClients ? "border-destructive" : ""}`}>
                        <SelectValue placeholder="Select answer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">NONE (Starting new)</SelectItem>
                        <SelectItem value="under-10">Under 10</SelectItem>
                        <SelectItem value="over-10">Over 10</SelectItem>
                        <SelectItem value="varies">Varies</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.currentClients && <p className="text-sm text-destructive">{errors.currentClients}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interest" className="text-foreground font-medium">Why are you interested in this position? (optional)</Label>
                    <Textarea 
                      id="interest" 
                      rows={4} 
                      className="bg-secondary/30 border-primary/20 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hire" className="text-foreground font-medium">Why should we hire you? (optional)</Label>
                    <Textarea 
                      id="hire" 
                      rows={4} 
                      className="bg-secondary/30 border-primary/20 focus:border-primary"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit My Application"}
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="mt-10 text-center">
                <p className="text-white/90 mb-4">Have questions? Send us an email!</p>
                <a 
                  href="mailto:support@dutycleaners.ca" 
                  className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors"
                >
                  <Mail className="w-5 h-5 text-accent" />
                  <span className="font-semibold">support@dutycleaners.ca</span>
                </a>
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
