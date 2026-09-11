import { POLICY } from "@/data/policy";
import { deepCleanTierRows, formatPrice, HOURLY_RATE, standardTierRows } from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, HelpCircle, Home, Truck, Building2, HardHat, DollarSign, Award, Sparkles, MessageSquare, Shield, Heart } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import heroFaqLivingRoom from "@/assets/hero-faq-living-room.webp";
import { CITY_PROOF, RATING_CLAIM, hoursLineFor } from "@/data/proof";

/** Figures read from bk-config, so an answer cannot drift from the booking form. */
const STANDARD_FROM = standardTierRows()[0].price;
const DEEP_FROM = deepCleanTierRows()[0].price;
const HOURLY = formatPrice(HOURLY_RATE);
const TRAVEL_FEE = formatPrice(travelFee("standard") ?? 0);
const POST_CONSTRUCTION_TRAVEL_FEE = formatPrice(travelFee("post-construction") ?? 0);

const FAQ_DESCRIPTION =
  "Answers about house cleaning in Edmonton and Calgary: prices before GST, what each clean includes, access, payment and the 24-hour re-clean.";

interface FAQCategory {
  title: string;
  icon: React.ElementType;
  items: { question: string; answer: string; link?: { text: string; href: string } }[];
}

const faqCategories: FAQCategory[] = [
  {
    title: "Standard House Cleaning",
    icon: Home,
    items: [
      {
        question: "Does standard cleaning include cleaning the kitchen?",
        answer: "Yes. A standard clean covers the kitchen counters, sink and stovetop, the outside of the appliances and cupboards, inside and outside the microwave, and the floor. Inside the oven and fridge are add-ons on a standard clean.",
      },
      {
        question: "What is included in the standard cleaning service?",
        answer: "A standard clean, one-time or recurring, covers dusting reachable surfaces and furniture, vacuuming carpets and rugs, mopping hard floors, and scrubbing the bathrooms: toilets, tubs, showers, sinks and mirrors. In the kitchen it covers the counters, sink, stovetop, the outside of the appliances and cabinets, and inside and outside the microwave. Bins are emptied and the bags tied. Decluttering and organising are a separate hourly add-on.",
      },
      {
        question: "Do you make beds during standard cleaning?",
        answer: "Bed-making is not part of the standard checklist, and laundry is not included either.",
      },
      {
        question: "What's the difference between standard and deep cleaning?",
        answer: "A standard clean keeps a home that is already in reasonable shape clean: dusting, vacuuming, mopping, the bathrooms and the kitchen. A deep clean is the standard checklist plus the deep-clean package, which adds detailed work on the parts a regular clean passes over, such as baseboards and doors. It is the right first clean for a home that has not been professionally cleaned in a while.",
      },
      {
        question: "How often should I schedule recurring cleaning?",
        answer: "Weekly suits a large household or a home with pets, bi-weekly suits most homes lived in every day, and every 4 weeks suits a smaller or quieter home. Every 4 weeks is what many people mean by monthly, and it works out to 13 visits a year. You can change or pause a recurring schedule with 24 hours' notice before the next visit.",
      },
      {
        question: "How long does a house cleaning take?",
        answer: "Time depends on the home's size, its condition and the service booked, so we do not quote a set number of hours. We work to a checklist, not a clock: the team stays until every task in the service scope is done. The rate is flat by home size, so it costs the same whether the clean runs short or long.",
      },
      {
        question: "Should I tip the cleaners?",
        answer: "Tipping is not expected and never required. The quoted price plus 5% GST is the whole bill. A review helps and costs nothing.",
      },
      {
        question: "What happens if something is damaged during a clean?",
        answer: "Tell us as soon as you notice. Send photos or video within 24 hours, by phone or to support@dutycleaners.ca, so we can look into it while the details are fresh — we will ask the team what happened, come back to you with what we find, and put it right where we are at fault. If a clean simply missed something rather than damaged it, that falls under the 24-hour re-clean guarantee instead.",
      },
      {
        question: "What time will the cleaners arrive?",
        answer: "We book an arrival window rather than an exact time, so traffic or an earlier job running long does not push your whole day. The windows are 9:00 to 10:00 AM, 12:00 to 1:00 PM and 3:00 to 4:00 PM. You are told which window is yours when you book.",
      },
      {
        question: "What is your cancellation policy?",
        answer: `We ask for at least 24 hours' notice to change or cancel a clean, so we can offer the slot to someone else. Cancelling or rescheduling inside 24 hours is charged ${POLICY.cancellationFee}. There is no long-term contract, and you can change or pause a recurring schedule with 24 hours' notice before the next visit.`,
      },
      {
        // The cancellation answer above is entirely about what the customer
        // owes. This is the other half, and it was missing from the whole site.
        question: "What if you have to cancel or reschedule on me?",
        answer: POLICY.ourCancellationNote ?? "",
      },
      {
        question: "What if the cleaners cannot get in?",
        answer: "If the team arrives and cannot get into the home because no key was left, a code does not work or nobody can let them in, the visit is charged at half the cost of the scheduled service. The cleaner has already travelled and the slot cannot be reassigned at that point. Letting us know at least 24 hours ahead avoids the charge.",
      },
      {
        question: "What are your operating hours?",
        answer: `The Edmonton and Calgary offices answer ${hoursLineFor("edmonton")}. The Red Deer office answers ${hoursLineFor("reddeer")}. Cleans are booked into an arrival window of 9:00 to 10:00 AM, 12:00 to 1:00 PM or 3:00 to 4:00 PM.`,
      },
      {
        question: "Do I need to be home during the cleaning?",
        answer: "No. Most customers leave a key, a lockbox code or smart-lock access, and the team locks up when it finishes. Every cleaner is reference-checked before a first job and rated by the customer after each visit.",
      },
      {
        question: "Do I need to clean before the cleaners arrive?",
        answer: "No. Clear counters and floors get cleaned and cluttered ones get worked around, so clearing the surfaces you most want done is the only preparation that helps. Put away anything you do not want touched, and tell us which rooms matter most.",
      },
      {
        question: "What should I do to prepare for a cleaning service?",
        answer: "Pick up clothing, toys and dishes so the team can reach the surfaces, and tell us your priorities and any rooms to skip when you book. Small items may be straightened if it takes a minute or two, but decluttering and organising are a separate hourly add-on rather than part of the clean.",
      },
      {
        question: "Do I need to provide cleaning supplies?",
        answer: `No. The team brings all cleaning supplies and equipment. Optional alternative products are available for ${POLICY.ecoProductsFee} before GST: ${POLICY.ecoProductsHowToRequest}.`,
      },
      {
        question: "Do you take out the trash after cleaning?",
        answer: "On a standard or deep clean the team ties the bags and leaves them inside the home, or takes them to an outside bin if there is one. Tell us where you would like them left.",
      },
      {
        question: "How do I schedule a cleaning appointment?",
        answer: "Book online through the instant price, or call the Edmonton office at (780) 913-6565 or the Calgary office at (403) 768-1341. Online bookings need at least 24 hours' notice; for anything sooner, call and ask what the schedule has open.",
      },
    ],
  },
  {
    title: "Deep Cleaning",
    icon: Sparkles,
    items: [
      {
        question: "Can I book deep cleaning for only certain areas?",
        answer: "A deep clean is the standard checklist plus the deep-clean package, priced flat by home size. To ask about a deep clean of specific areas only, call the Edmonton or Calgary office.",
      },
      {
        question: "Should I declutter before deep cleaning?",
        answer: "Yes. Clear the clutter before the appointment so the team can reach the surfaces and clean them properly. Clear counters and floors get cleaned, and cluttered ones get worked around.",
      },
      {
        question: "Is deep cleaning more expensive than standard cleaning?",
        answer: `Yes. A deep clean is the standard checklist plus the deep-clean package, so it costs more at every home size. For a 1-bedroom, 1-bathroom apartment or condo it starts at ${DEEP_FROM} against ${STANDARD_FROM} for a standard clean, before 5% GST. A larger home type, pets or an address outside city limits add to either price.`,
      },
      {
        question: "Does deep cleaning remove mould or mildew?",
        answer: "We may wipe light surface mildew where it is safe to, but we do not provide mould remediation or remove heavy mould.",
        link: { text: "we do not provide mould remediation", href: "https://www.canada.ca/en/health-canada/services/publications/healthy-living/addressing-moisture-mould-your-home.html" },
      },
      {
        question: "What does a deep cleaning include?",
        answer: "A deep clean covers everything in a standard clean plus the deep package: baseboards, doors and door frames, light switches, wall outlets and vent covers, cobwebs where there are any, and a detailed stovetop, grates and fridge top. Inside the oven and fridge stay add-ons.",
      },
      {
        question: "How often should I book a deep clean?",
        answer: "Book one before a recurring schedule starts, after hosting, or at the change of season, and as the first clean for a home that has gone a while without one. Between deep cleans, a standard clean keeps the home maintained.",
      },
      {
        question: "Do you clean grout, hard-water stains, or fixtures like fans and chandeliers?",
        answer: "Grout restoration is not offered, but hard-water stains are cleaned: hard Alberta water leaves mineral scale on taps and shower glass. Ceiling fans are not part of any package: the team dusts them on request, where a 3-step ladder reaches them safely. Chandeliers, light bulbs and other fragile fixtures are not included.",
      },
      {
        question: "What if my home needs extra attention or is very dirty?",
        answer: "The flat price is based on the home size and condition you describe when you book, and it does not change because a clean takes longer than expected. If the home needs substantially more work than described, such as heavy build-up or far more glass or cabinetry than stated, the team explains what it found and the options before continuing.",
      },
      {
        question: "Does the deep cleaning package include wall washing and cleaning inside appliances?",
        answer: "No. Wall washing is a separate package booked together with a clean, and inside the oven and inside the fridge are add-ons on a deep clean. A move-in or move-out clean is the service that includes the inside of the oven and fridge.",
      },
    ],
  },
  {
    title: "Move-In & Move-Out Cleaning",
    icon: Truck,
    items: [
      {
        question: "What's included in a move-out cleaning?",
        answer: "A move-in or move-out clean is the deep-clean checklist plus inside all cabinets, drawers and closets, the window sills, and inside the oven, fridge and microwave. The home is cleaned empty, to the standard a move-out inspection looks for. We do not promise a deposit comes back; the landlord decides.",
      },
      {
        question: "How long does a move-out cleaning take?",
        answer: "We do not quote a set number of hours for a move-out clean. The team works through the full move-out checklist, including inside the cabinets, closets and appliances, until every task is done. The flat rate stays the same however long that takes.",
      },
      {
        question: "Do you clean inside appliances?",
        answer: "On a move-in or move-out clean, yes: inside the oven, fridge and microwave are on the checklist. On a standard or deep clean, inside the microwave is included and inside the oven and fridge are add-ons.",
      },
      {
        question: "Do you clean behind appliances?",
        answer: "The team cleans behind the oven and fridge only if they are pulled out before it arrives. Cleaners do not move heavy appliances or lift anything over 25 lb.",
      },
      {
        question: "Do you clean walls during move-out cleaning?",
        answer: "Heavy scrubbing of walls is the wall-washing package, which is booked together with the clean rather than on its own. It comes as spot cleaning or a full wash, each priced by home size. Tell us which rooms need it when you book.",
      },
      {
        question: "What if I'm moving in, but the home is not empty? Can I still book a move-in cleaning?",
        answer: "It depends on how much is still in the home. With only a few pieces of furniture that the team can clean around, it can usually still be booked as a move-in clean. If the home is fully furnished and the cabinets, closets and storage are full, a deep clean with the add-ons you need is usually the better fit. If you are not sure which suits your home, call the Edmonton or Calgary office and describe it.",
      },
      {
        question: "Do you clean exterior windows or carpets professionally?",
        answer: "Window sills are on the move-in and move-out checklist, and interior window glass is an add-on. Exterior windows and carpet steam cleaning are not part of any service, so book a specialist for those.",
      },
      {
        question: "Can move-in/move-out cleaning be done the same day as moving?",
        answer: "It can be, but leave enough time between the move and the clean for the furniture and boxes to be out when the team arrives, because the move-out checklist covers the inside of the cabinets, closets and appliances.",
      },
      {
        question: "Can you clean a home with no running water?",
        answer: "No. Running water is required for the clean, so check that it is on before the team arrives.",
      },
      {
        question: "Can you clean a home with no electricity?",
        answer: "Without electricity, vacuuming may not be possible and unlit rooms are hard to clean properly. Running water is required either way.",
      },
    ],
  },
  {
    // This category was "Office & Commercial Cleaning". The content prompt keeps
    // commercial work off the house-cleaning pages, so those six answers are
    // gone; the Airbnb turnover question that sat among them stays.
    title: "Airbnb & Short-Term Rentals",
    icon: Building2,
    items: [
      {
        question: "Do you handle Airbnb and short-term rental turnovers?",
        answer: `Yes. Airbnb and short-term rental turnovers are priced by the hour, at ${HOURLY} per cleaner-hour before GST, with a minimum of 3 hours for one cleaner or 2 hours for two. Linen changes and restocking from your own supplies are available when the clean linen and supplies are left out for the team. Same-day and next-day slots depend on the schedule, so book each turnover as early as you can.`,
      },
    ],
  },
  {
    title: "Post-Construction Cleaning",
    icon: HardHat,
    items: [
      {
        question: "What is post-construction cleaning?",
        answer: `Post-construction cleaning removes the fine dust and residue left after building or renovation work: detailed dusting of every surface, window sills, vacuuming, mopping, and detailed cleaning of the kitchen and bathrooms. It is priced by square footage rather than by bedrooms. Outside Edmonton or Calgary city limits a post-construction clean carries its own travel fee of ${POST_CONSTRUCTION_TRAVEL_FEE} per visit.`,
      },
      {
        question: "What is NOT included in post-construction cleaning?",
        answer: "Post-construction cleaning does not include inside vents or ductwork, grout restoration, removing construction materials, paint or stain stripping, or exterior windows. Light bulbs and fragile fixtures are not included, and nothing past the reach of a 3-step ladder is cleaned. The service covers the interior surfaces, the kitchen and the bathrooms.",
      },
      {
        question: "Does post-construction cleaning include debris removal?",
        answer: "No. We do not haul construction waste or remove junk, so clear the debris out before the team arrives.",
      },
      {
        question: "How soon after construction can you clean?",
        answer: "Book the clean for after all the work is finished, including painting and flooring, and after the contractors have taken their materials and equipment away. Dates depend on the schedule, so book as early as you can.",
      },
    ],
  },
  {
    title: "Pricing & Payment",
    icon: DollarSign,
    items: [
      {
        question: "When am I charged?",
        answer: "Your card is charged after the clean, not before. Nothing is charged when you book. The day before your appointment a temporary hold goes on your card to confirm it is valid; it can look like a charge in your banking app, but no money moves. The card is charged only once the clean is complete.",
      },
      {
        question: "How does your pricing work?",
        answer: "Homes are priced flat by home size, and the exact figure shows before you book, plus 5% GST. It does not go up because a clean took longer than expected. The pet charge, a larger home type and the travel fee outside city limits are added on the quote where they apply. If the home needs substantially more work than you described, such as heavy build-up or far more glass or cabinetry, the team explains what it found and the options before continuing.",
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept Visa, Mastercard, American Express, debit and e-transfer. Card details are taken at booking because a temporary hold goes on the card the day before the clean, and payment is taken once the clean is complete.",
      },
      {
        question: "Do you offer discounts for recurring services?",
        answer: "Yes. A recurring standard clean is 20% off weekly, 15% off bi-weekly and 10% off every 4 weeks, from the second visit. The first clean is charged at the one-time rate.",
      },
      {
        question: "Do you offer gift cards?",
        answer: "Yes. Duty Cleaners gift cards come in any amount, and they do not expire. The balance stays on the card across visits, and if a clean costs more than the balance, the recipient pays the difference.",
      },
    ],
  },
  {
    title: "Service Quality & Trust",
    icon: Award,
    items: [
      {
        question: "What if I'm not happy with the clean?",
        answer: `Tell us within ${POLICY.guaranteeWindowHours} hours of the clean and we come back and re-clean what was missed at no charge. Photos help but are not required. The guarantee is a return visit rather than a money-back guarantee; if you would like something else, call and talk it through.`,
      },
      {
        question: "Who will be cleaning my home?",
        answer: "Your clean is done by a cleaner from the Duty Cleaners team in your city. Every cleaner is reference-checked before a first job and rated by the customer after each visit, and those ratings decide who we keep sending. On a recurring schedule, you get your regular team where we can send them.",
      },
      {
        question: "My home is in rough shape. Will you judge me?",
        answer: "No. Some homes get away from people, and the team cleans them without commentary. You do not need to tidy first or explain anything. Bodily fluids, pests and rodents, and hoarding situations are outside what we handle; for those we will point you to a specialist where we can.",
      },
      {
        question: "Which areas do you serve?",
        answer: `The Edmonton office covers 80 Edmonton neighbourhoods plus St. Albert, Sherwood Park, Spruce Grove, Leduc, Beaumont, Fort Saskatchewan, Stony Plain, Morinville and Devon. The Calgary office covers 66 Calgary neighbourhoods plus Airdrie, Cochrane, Okotoks, Chestermere, Strathmore, High River, Langdon, Crossfield and Diamond Valley, which includes Black Diamond and Turner Valley. There is no trip fee inside either city's limits; outside them a ${TRAVEL_FEE} travel fee is added per visit on a home clean. Red Deer has its own office at ${CITY_PROOF.reddeer.streetAddress}, on ${CITY_PROOF.reddeer.phone}, with the same price list and no travel fee inside Red Deer city limits; for an address outside Red Deer, call the Red Deer office. For any other address that is not listed, call the branch.`,
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
                    {/* text-brand-gold is 4.74:1 on the navy bands and correct there, but
                        these numbers sit on the near-white accordion — 2.30:1 at 14px,
                        against the 4.5:1 AA needs. --gold-ink is the same hue built for
                        light surfaces and already wired as a utility. */}
                    <span className="shrink-0 text-sm font-bold text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
                    <span>{item.question}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm pb-4 whitespace-pre-line">
                  {renderAnswer(item)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

/**
 * An answer with one phrase linked to its official source. The FAQPage schema
 * keeps the plain answer text; only the visible answer carries the link.
 */
const renderAnswer = (item: { answer: string; link?: { text: string; href: string } }) => {
  const at = item.link ? item.answer.indexOf(item.link.text) : -1;
  if (!item.link || at < 0) return item.answer;
  return (
    <>
      {item.answer.slice(0, at)}
      <a href={item.link.href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
        {item.link.text}
      </a>
      {item.answer.slice(at + item.link.text.length)}
    </>
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
        <title>House Cleaning FAQs – Edmonton & Calgary | Duty Cleaners</title>
        <meta name="description" content={FAQ_DESCRIPTION} />
        <meta name="keywords" content="cleaning FAQ, house cleaning questions, Edmonton cleaning, Calgary cleaning, cleaning service hours" />
        <link rel="canonical" href="https://dutycleaners.ca/faqs/" />
        <meta property="og:title" content="House Cleaning FAQs – Edmonton & Calgary | Duty Cleaners" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaning FAQs – Edmonton & Calgary | Duty Cleaners" />
        <meta name="twitter:description" content={FAQ_DESCRIPTION} />
        <meta property="og:description" content={FAQ_DESCRIPTION} />
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
          alt="Bright living room with a pale sectional sofa, a wooden coffee table and light wood floors"
          className="absolute inset-0 w-full h-full object-cover"
         loading="eager" fetchPriority="high"/>
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
              House Cleaning FAQs for Edmonton and Calgary
            </h1>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Prices, what each clean includes, access, payment and the 24-hour re-clean
              guarantee, answered for both cities.
            </p>

            {/* Quick Contact */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-xl mx-auto border border-white/10">
              <p className="text-white/80 text-sm mb-4">For a question not answered here, call the office for your city:</p>
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
              { icon: Heart, label: "24-Hour Re-Clean Guarantee" },
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
              The most common questions, grouped by service and topic.
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
                      See your price in about a minute, without a phone call.
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
                Call the Edmonton, Calgary or Red Deer office
              </h2>
              <p className="text-lg text-white/80 mb-3 max-w-2xl mx-auto">
                The Edmonton and Calgary offices answer the phone seven days a week and the Red Deer
                office Monday to Saturday, or you can see your price online in about a minute.
              </p>
              <p className="text-sm text-white/90 mb-8">Edmonton and Calgary: {hoursLineFor("edmonton")}. Red Deer: {hoursLineFor("reddeer")}.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#quote"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors shadow-lg"
                >
                  <DollarSign className="w-4 h-4" />
                  See My Instant Price
                </a>
                <a
                  href="/contact-us/"
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
