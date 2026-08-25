import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, HelpCircle, Home, Truck, Building2, HardHat, DollarSign, Award, Sparkles, MessageSquare, Shield, Heart } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import heroFaqLivingRoom from "@/assets/hero-faq-living-room.jpg";
import { RATING_CLAIM } from "@/data/proof";

interface FAQCategory {
  title: string;
  icon: React.ElementType;
  items: { question: string; answer: string }[];
}

const faqCategories: FAQCategory[] = [
  {
    title: "Standard House Cleaning",
    icon: Home,
    items: [
      {
        question: "Does standard cleaning include cleaning the kitchen?",
        answer: "Yes. We clean kitchen counters, sinks, exterior appliance surfaces, outside of the cupboards, and floors.",
      },
      {
        question: "What is included in the standard cleaning service?",
        answer: "Our standard recurring clean covers dusting all accessible surfaces, vacuuming carpets and rugs, mopping hard floors, sanitizing bathrooms (toilets, sinks, showers, mirrors), kitchen surfaces (countertops, sinks, stovetop, exterior of appliances and cabinets), wiping high-touch points, emptying trash, and light tidying of common areas.",
      },
      {
        question: "Do you make beds during standard cleaning?",
        answer: "Bed-making is not included in our standard cleaning service; however, if you let us know in advance, we will go above and beyond for you. Just ensure that the bedding is prepared when we arrive.",
      },
      {
        question: "What's the difference between standard and deep cleaning?",
        answer: "Standard recurring cleaning maintains a home that is already in reasonable shape — dusting, vacuuming, mopping, and sanitizing high-use areas. Deep cleaning is a more detailed reset that tackles built-up grime, baseboards, door frames, light switches, wall outlets, and outside vent covers.",
      },
      {
        question: "How often should I schedule recurring cleaning?",
        answer: "Most households in Alberta choose bi-weekly. Weekly works best for larger families, homes with pets, or busy schedules; monthly is a good fit for smaller, lower-traffic homes. You can change or pause your frequency at any time.",
      },
      {
        question: "What time will the cleaners arrive?",
        answer: "We schedule to an arrival window rather than an exact time, so traffic or an earlier job running long does not push your whole day. The windows are 9:00 – 10:00 AM, 12:00 – 1:00 PM, and 3:00 – 4:00 PM. You will be told which window is yours when you book.",
      },
      {
        question: "What is your cancellation policy?",
        answer: "We ask for at least 24 hours' notice to change or cancel a clean, so we can offer the slot to someone else. Cancelling or rescheduling inside 24 hours is charged $50. There is no long-term contract, and you can change or pause a recurring schedule at any time.",
      },
      {
        question: "What if the cleaners cannot get in?",
        answer: "If our team arrives and cannot get into the home — no key left, a code that does not work, or nobody able to let them in — the visit is charged at half the cost of the scheduled service. The cleaner has already travelled and the slot cannot be reassigned at that point. Letting us know at least 24 hours ahead avoids this entirely.",
      },
      {
        question: "What happens if something is damaged during a clean?",
        answer: "Tell us as soon as you notice. Send photos or video within 24 hours so we can investigate while the details are still fresh, either by phone or to support@dutycleaners.ca, and we will look into what happened and come back to you.",
      },
      {
        question: "What are your operating hours?",
        answer: "We're available Monday through Saturday from 8:00 AM to 8:00 PM, and Sundays from 9:00 AM to 3:00 PM. We offer flexible scheduling to accommodate your busy lifestyle.",
      },
      {
        question: "Do I need to be home during the cleaning?",
        answer: "No. Most clients provide a lockbox code, smart-lock access, or leave a key. All our cleaners are reference-checked and customer-rated, and we lock up securely when finished.",
      },
      {
        question: "Do I need to clean before the cleaners arrive?",
        answer: "No \u2014 please don't. Clear the surfaces you'd like us to focus on, move anything you don't want touched, and tell us which rooms matter most. That's all the preparation we need. See our full guide at /prepare.",
      },
      {
        question: "What should I do to prepare for a cleaning service?",
        answer: "Pick up clothing, toys, dishes, and excessive clutter so our team can focus on detailed cleaning. Small items may be lightly organized if it only takes a minute or two, but our primary focus is professional cleaning rather than full decluttering or home organization. Let us know any priorities or areas to skip.",
      },
      {
        question: "Do I need to provide cleaning supplies?",
        answer: "No — our team brings all cleaning supplies and equipment, including non-toxic products that are safe for children and pets.",
      },
      {
        question: "Do you take out the trash after cleaning?",
        answer: "No — for standard and deep cleaning we tie the trash bags and leave them in your home. If there's a bin outside, we'll be glad to take them there. You can also let us know where you'd like us to leave the trash.",
      },
      {
        question: "How do I schedule a cleaning appointment?",
        answer: "You can book online through our website or call us directly at (780) 913-6565 for Edmonton or (403) 768-1341 for Calgary. We offer same-day and next-day appointments based on availability.",
      },
    ],
  },
  {
    title: "Deep Cleaning",
    icon: Sparkles,
    items: [
      {
        question: "Can I book deep cleaning for only certain areas?",
        answer: "Yes, you may request deep cleaning for specific areas, such as bathrooms, kitchen, basement, or main floor only.",
      },
      {
        question: "Should I declutter before deep cleaning?",
        answer: "Yes, we recommend removing clutter before the appointment so our team can focus on cleaning surfaces properly.",
      },
      {
        question: "Is deep cleaning more expensive than standard cleaning?",
        answer: "Yes, deep cleaning usually costs more because it requires more time, detail, and effort.",
      },
      {
        question: "Does deep cleaning remove mold or mildew?",
        answer: "We may wipe light surface mildew if safe, but we do not provide mold remediation or remove heavy mold.",
      },
      {
        question: "What does a deep cleaning include?",
        answer: "Deep cleaning covers everything in a standard clean plus detailed work on baseboards, door frames, light switches, wall outlets, and outside vent covers.",
      },
      {
        question: "How often should I book a deep clean?",
        answer: "Most homes benefit from a deep clean every 3 to 6 months. We also recommend deep cleaning before starting a new recurring schedule, after hosting, or seasonally in spring and fall.",
      },
      {
        question: "Do you clean grout, hard-water stains, or fixtures like fans and chandeliers?",
        answer: "We do not currently offer grout restoration, but we do clean hard water stains. For light fixtures, if they are safely reachable, we can attempt to clean them for you; however, this is not a specialized service we provide. Ceiling fans can also be cleaned as long as they are safely reachable. If you have any questions or need clarification, feel free to reach out to us.",
      },
      {
        question: "What if my home needs extra attention or is very dirty?",
        answer: "Our estimates are based on the details shared when booking. In uncommon cases where the home's actual condition requires substantially more time than expected, extra charges may apply. If that situation comes up, the team will explain what they found and the available options so you can make an informed decision.",
      },
      {
        question: "Does the deep cleaning package include wall washing and cleaning inside appliances?",
        answer: "No. Wall washing is a separate package, and cleaning the inside of appliances (oven, and fridge) is available as an add-on. Deep cleaning covers everything in a standard clean plus detailed work on baseboards, doors, light switches, wall outlets, and outside vent covers.",
      },
    ],
  },
  {
    title: "Move-In & Move-Out Cleaning",
    icon: Truck,
    items: [
      {
        question: "What's included in a move-out cleaning?",
        answer: "Move-in and move-out cleaning is comprehensive: everything in our deep clean plus inside all cabinets and drawers, inside closets, wiping light switches and outlet covers, door frames, window sills, and inside the oven, refrigerator, dishwasher, and microwave so the home is move-in ready.",
      },
      {
        question: "How long does a move-out cleaning take?",
        answer: "We don't quote a set number of hours. We send one or two cleaners and work through the full move-out checklist — inside cabinets, closets, appliances, baseboards and more — until it is done. Your flat rate stays the same regardless of how long that takes.",
      },
      {
        question: "Do you clean inside appliances?",
        answer: "Yes — our move-out cleaning includes inside the oven, refrigerator, dishwasher, and microwave so everything is spotless for the next tenant or owner.",
      },
      {
        question: "Do you clean behind appliances?",
        answer: "We can clean behind appliances only if they are already pulled out before our team arrives. Our cleaners do not move heavy appliances.",
      },
      {
        question: "Do you clean walls during move-out cleaning?",
        answer: "Wall spot cleaning or full wall washing may be available. Please let us know what level of wall cleaning you need. The only area that will be included in the package would be the kitchen walls, but if you need other wall areas to be cleaned, this will be an add-on.",
      },
      {
        question: "What if I'm moving in, but the home is not empty? Can I still book a move-in cleaning?",
        answer: "It depends on how much furniture and belongings are still in the home.\n\nIf there are only a few pieces of furniture and we do not need to move or clean around them extensively, we can usually still book your service as a move-in cleaning.\n\nHowever, if the home is still fully furnished and the cabinets, closets, and storage areas contain belongings, a move-in cleaning may not be the best fit. In that case, we would typically recommend our Deep Cleaning package along with any additional add-ons you may need. If you're unsure which service is right for your situation, feel free to contact us, and we'll be happy to help determine the best option.",
      },
      {
        question: "Do you clean exterior windows or carpets professionally?",
        answer: "We clean interior window glass and sills as part of move-in/out service. Exterior window cleaning and steam carpet cleaning are not included — we recommend specialists for those services.",
      },
      {
        question: "Can move-in/move-out cleaning be done the same day as moving?",
        answer: "It can be, but we recommend allowing enough time between moving and cleaning so our team can work efficiently.",
      },
      {
        question: "Can you clean a home with no running water?",
        answer: "No, running water is required for most cleaning tasks.",
      },
      {
        question: "Can you clean a home with no electricity?",
        answer: "Some cleaning tasks may not be possible without electricity. Vacuuming and proper visibility may be affected.",
      },
    ],
  },
  {
    title: "Office & Commercial Cleaning",
    icon: Building2,
    items: [
      {
        question: "What is included in commercial cleaning?",
        answer: "Commercial cleaning may include dusting, vacuuming, mopping, bathroom cleaning, breakroom cleaning, disinfecting touchpoints, and cleaning common areas.",
      },
      {
        question: "Do you offer commercial cleaning services?",
        answer: "Yes — we provide professional commercial cleaning for offices, retail spaces, medical facilities, and more in both Edmonton and Calgary. Services are customized to your business needs with flexible scheduling.",
      },
      {
        question: "Do you offer recurring commercial cleaning?",
        answer: "Yes, we can provide recurring commercial cleaning on a weekly, bi-weekly, monthly, or custom schedule depending on your business needs.",
      },
      {
        question: "Can you clean during business hours?",
        answer: "Yes, we can clean during business hours if preferred, but we recommend choosing a time that causes the least disruption to your staff and customers.",
      },
      {
        question: "Do you clean office kitchens or breakrooms?",
        answer: "Yes, we clean sinks, counters, tables, exterior appliance surfaces, and floors in office kitchens or breakrooms.",
      },
      {
        question: "Can you clean after business hours?",
        answer: "Yes, depending on our availability — we recommend letting us know at least a week in advance so we can schedule evening or weekend cleaning without interfering with your business operations.",
      },
      {
        question: "Do you handle Airbnb and short-term rental turnovers?",
        answer: "Yes. We provide turnover cleaning for Airbnb and short-term rentals with same-day or next-day scheduling depending on our availability, linen changes on request, and basic restocking of provided amenities. We still suggest letting us know at least a week in advance so we can guarantee a turnover slot between guests.",
      },
    ],
  },
  {
    title: "Post-Construction Cleaning",
    icon: HardHat,
    items: [
      {
        question: "What is post-construction cleaning?",
        answer: "Post-construction cleaning removes dust, debris, and residue left after construction or renovation work. It includes detailed dusting of all surfaces, interior window and sill cleaning, vacuuming, mopping, and detailed cleaning of kitchens and bathrooms so the space is move-in ready.",
      },
      {
        question: "What is NOT included in post-construction cleaning?",
        answer: "Our post-construction service does not include cleaning inside vents or ductwork, grout restoration, removal of construction materials, paint or stain stripping, or exterior window cleaning. For light fixtures and ceiling fans, if they are safely reachable, we can attempt to clean them for you; however, this is not a specialized service we provide. We focus on the interior surfaces, kitchens, and bathrooms.",
      },
      {
        question: "Does post-construction cleaning include debris removal?",
        answer: "We do not provide construction waste hauling or junk removal. Debris should be removed before our team arrives.",
      },
      {
        question: "How soon after construction can you clean?",
        answer: "We recommend waiting until all construction work is complete, including painting and flooring. Once contractors have removed their materials and equipment, we can schedule cleaning depending on our availability — we suggest letting us know at least a week in advance.",
      },
    ],
  },
  {
    title: "Pricing & Payment",
    icon: DollarSign,
    items: [
      {
        question: "When am I charged?",
        answer: "After your clean, not before. Nothing is charged when you book. The day before your appointment a temporary hold appears on your card to confirm it's valid — it can look like a charge in your banking app, but no money moves. Your card is charged only once the clean is complete.",
      },
      {
        question: "How does your pricing work?",
        answer: "Most homes are priced flat by size, so you see your exact number — plus 5% GST — before you book, and it doesn't go up because a clean took longer. If a flat rate doesn't suit your job or budget, we can quote hourly instead and we'll tell you which works out cheaper. Your quote is based on the size and condition you describe. If the job turns out bigger once we're in it — heavy build-up, extra cabinets or glass — we'll let you know what changed and why.",
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept debit and credit cards (Visa, Mastercard, and Amex) as well as e-transfer. A hold will be placed on the card one day before the service, so we require the card details at the time of booking. Payment is due upon completion of the service.",
      },
      {
        question: "Do you offer discounts for recurring services?",
        answer: "Yes — recurring schedules unlock ongoing savings: 20% off weekly visits, 15% off bi-weekly visits, and 10% off monthly visits. Commercial contracts may qualify for additional rates.",
      },
      {
        question: "Do you offer gift cards?",
        answer: "Yes — Duty Cleaners gift cards are available in multiple tiers and designs. They're a thoughtful gift for housewarmings, new parents, or anyone who could use a break from cleaning.",
      },
    ],
  },
  {
    title: "Service Quality & Trust",
    icon: Award,
    items: [
      {
        question: "What if I'm not happy with the clean?",
        answer: "Tell us within 24 hours and we'll come back and re-clean the areas you weren't happy with, free.",
      },
      {
        question: "Who will be cleaning my home?",
        answer: "A cleaner from our Edmonton and Calgary team. Every cleaner is reference-checked before their first job with us, and every clean is rated by the customer afterwards — those ratings decide who we keep sending. Cleaners who don't keep their scores up don't come back.",
      },
      {
        question: "My home is in rough shape. Will you judge me?",
        answer: "No. Some homes have gotten away from people, and those are jobs we're good at. You don't need to tidy first or explain anything. We clean, we leave, and there's no commentary. (The one limit: extreme biohazards — bodily fluids, pest infestations — need specialized services we can refer you to.)",
      },
      {
        question: "Do you bring supplies?",
        answer: "Yes — all supplies and equipment. Prefer eco-friendly products? Ask when booking and we can use them for a $15 add-on.",
      },
      {
        question: "Which areas do you serve?",
        answer: "We proudly offer our cleaning services across Alberta, primarily serving Edmonton and its neighboring cities, as well as Calgary and nearby communities.\n\nOur Edmonton service area includes St. Albert, Sherwood Park, Spruce Grove, Stony Plain, Beaumont, Leduc, Fort Saskatchewan, Devon, Morinville, and surrounding areas.\n\nOur Calgary service area includes Airdrie, Cochrane, Chestermere, Okotoks, High River, Strathmore, Langdon, Crossfield, Turner Valley, and nearby communities.",
      },
    ],
  },
];

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const FAQCategoryCard = ({ category, categoryIndex }: { category: FAQCategory; categoryIndex: number }) => {
  const { ref, isVisible } = useScrollAnimation(0.05);
  const Icon = category.icon;

  return (
    <div
      ref={ref}
      className={`opacity-0 ${isVisible ? "animate-fade-slide-up" : ""}`}
      style={{ animationDelay: `${categoryIndex * 80}ms`, animationFillMode: "forwards" }}
    >
      <div id={slugify(category.title)} className="scroll-mt-28 bg-card rounded-xl shadow-sm border border-border overflow-hidden group">
        {/* Category Header */}
        <div className="bg-brand-navy p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
            <Icon className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-xl font-bold text-white">{category.title}</h2>
        </div>

        {/* Accordion Items */}
        <div className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {category.items.map((item, i) => (
              <AccordionItem key={i} value={`item-${categoryIndex}-${i}`} className="border-border/50">
                <AccordionTrigger className="text-left text-foreground hover:text-primary transition-colors text-[15px] py-4">
                  <span className="flex items-baseline gap-3">
                    <span className="shrink-0 text-sm font-bold text-brand-gold">{String(i + 1).padStart(2, "0")}</span>
                    <span>{item.question}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm pb-4 whitespace-pre-line">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default function FAQ() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqCategories.flatMap((c) =>
      c.items.map((i) => ({
        "@type": "Question",
        name: i.question,
        acceptedAnswer: { "@type": "Answer", text: i.answer },
      }))
    ),
  };
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>FAQ - Duty Cleaners | House Cleaning Questions Answered</title>
        <meta name="description" content="Find answers to common questions about Duty Cleaners' house cleaning services in Edmonton and Calgary. Pricing, scheduling, services, and more." />
        <meta name="keywords" content="cleaning FAQ, house cleaning questions, Edmonton cleaning, Calgary cleaning, cleaning service hours" />
        <link rel="canonical" href="https://dutycleaners.ca/faqs/" />
        <meta property="og:title" content="FAQ - Duty Cleaners | House Cleaning Questions Answered" />
        <meta property="og:description" content="Answers to common questions about Duty Cleaners' house cleaning services in Edmonton and Calgary." />
        <meta property="og:url" content="https://dutycleaners.ca/faqs/" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <Navigation />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <section className="bg-brand-navy py-20 relative overflow-hidden">
        <img width={1920} height={1088}
          src={heroFaqLivingRoom}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/85 via-brand-navy/75 to-brand-navy/85" />
        {/* Decorative blur elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/10">
              <HelpCircle className="w-4 h-4 text-accent" />
              <span className="text-white/90 text-sm font-medium">Your Questions, Answered</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Everything you need to know about our professional cleaning services in Alberta.
            </p>

            {/* Quick Contact */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-xl mx-auto border border-white/10">
              <p className="text-white/80 text-sm mb-4">Can't find what you're looking for? Reach out directly:</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="tel:7809136565"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  Edmonton: (780) 913-6565
                </a>
                <a
                  href="tel:4037681341"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-brand-navy font-semibold rounded-lg hover:bg-white/90 transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  Calgary: (403) 768-1341
                </a>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 max-w-2xl mx-auto">
            {[
              { icon: Shield, label: "Pay After Your Clean" },
              { icon: Heart, label: "24hr Guarantee" },
              { icon: Award, label: RATING_CLAIM },
            ].map(({ icon: BadgeIcon, label }) => (
              <div key={label} className="flex items-center gap-2 text-white/90 text-sm">
                <BadgeIcon className="w-4 h-4 text-accent" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span className="text-foreground text-sm font-medium">Browse by Topic</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Find Your Answer
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We've organized the most common questions by category to help you find what you need quickly.
            </p>
          </div>

          {/* Ten categories with no way to navigate was a scroll trap. */}
          <nav aria-label="Jump to a question category" className="mx-auto mb-10 max-w-4xl">
            <ul className="flex flex-wrap justify-center gap-2">
              {faqCategories.map((category) => (
                <li key={category.title}>
                  <a
                    href={`#${slugify(category.title)}`}
                    className="inline-flex min-h-[44px] items-center rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:border-brand-navy hover:bg-secondary"
                  >
                    {category.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqCategories.map((category, index) => (
              <div key={index}>
                <FAQCategoryCard category={category} categoryIndex={index} />
                {/* Mid-page ask: most visitors have their answer by now. */}
                {index === 2 && (
                  <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-border bg-secondary/50 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
                    <p className="text-base font-semibold text-foreground">
                      Got what you needed? See your price in about 60 seconds — no phone call.
                    </p>
                    <a
                      href="#quote"
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-accent px-7 font-semibold text-accent-foreground shadow-lg transition-colors hover:bg-accent/90"
                    >
                      <DollarSign className="h-4 w-4" />
                      See My Instant Price
                    </a>
                  </div>
                )}
              </div>
            ))}
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
                Still have a question? Talk to a real human.
              </h2>
              <p className="text-lg text-white/80 mb-3 max-w-2xl mx-auto">
                We're here to help! Reach out to our friendly team or get an instant quote online.
              </p>
              <p className="text-sm text-white/90 mb-8">Mon&ndash;Sat 8 AM&ndash;8 PM &middot; Sun 9 AM&ndash;3 PM</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#quote"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors shadow-lg"
                >
                  <DollarSign className="w-4 h-4" />
                  See My Instant Price
                </a>
                <a
                  href="/contact-us"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 font-semibold text-white underline underline-offset-4 hover:text-brand-gold transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Contact us instead
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
