import { Link } from "react-router-dom";
import { BadgeCheck, HeartHandshake, Receipt, RotateCcw, ArrowRight, type LucideIcon } from "lucide-react";
import { POLICY } from "@/data/policy";

interface Pillar {
  icon: LucideIcon;
  title: string;
  desc: string;
}

/**
 * Two voices for one set of terms. Both hubs render this block, and the
 * money-page contract caps how much of the Calgary hub may repeat the
 * Edmonton one. Nothing differs between the cities except the wording; the
 * figures come from policy.ts either way. The About page uses the default.
 */
const PILLARS: Record<"Edmonton" | "Calgary", Pillar[]> = {
  Edmonton: [
    {
      icon: BadgeCheck,
      title: "Earned Trust, Every Visit",
      desc: "Every cleaner is reference-checked before their first job, then rated by the customer after every clean. Those ratings decide who keeps cleaning for us.",
    },
    {
      icon: HeartHandshake,
      title: "Judgment-Free, Always",
      desc: "You do not need to tidy before we arrive or explain the state of anything. Describe the home as it is on the booking form and the team arrives briefed. The jobs we do not take on are biohazards and infestations: bodily fluids, animal waste, mould remediation, pests and rodents.",
    },
    {
      icon: Receipt,
      title: "Priced on What You Tell Us",
      desc: "Your quote is built from your home's size and condition as you describe them. Some things only show themselves once we start: built-up grime under the surface, extra cabinets, glass railings. When the job turns out bigger than described, we let you know what changed and why.",
    },
    {
      icon: RotateCcw,
      title: "100% Satisfaction Guarantee",
      desc: `If something was missed, tell us within ${POLICY.guaranteeWindowHours} hours and we return to make it right at no additional charge.`,
    },
  ],
  Calgary: [
    {
      icon: BadgeCheck,
      title: "Earned Trust, Every Visit",
      desc: "References are checked before a cleaner's first job with us. After that, the customer's rating at the end of each visit decides whether they keep getting work.",
    },
    {
      icon: HeartHandshake,
      title: "Judgment-Free, Always",
      desc: "Do not tidy for us and do not explain the state of the place. Put it on the booking form as it is and the team arrives knowing. What we turn down: bodily fluids, animal waste, mould remediation, pests and rodents.",
    },
    {
      icon: Receipt,
      title: "Priced on What You Tell Us",
      desc: "The quote comes from the size and condition you describe. Some things only show up once the team is through the door: grime under the surface, more cabinets than expected, a glass railing. When the job is bigger than described, the team tells you what changed before carrying on.",
    },
    {
      icon: RotateCcw,
      title: "100% Satisfaction Guarantee",
      desc: `Anything missed, reported within ${POLICY.guaranteeWindowHours} hours, is put right on a return visit at no charge.`,
    },
  ],
};

const COPY = {
  Edmonton: {
    eyebrow: "Included With Every Clean",
    quote: "Trust isn’t something our cleaners claim. It’s something they earn at every visit.",
  },
  Calgary: {
    eyebrow: "Standing terms, every Calgary visit",
    quote: "A cleaner keeps working for us because Calgary customers keep rating them well. There is no other way to stay on the list.",
  },
} as const;

export default function DutyCleanPromise({ city = "Edmonton" }: { city?: "Edmonton" | "Calgary" }) {
  const pillars = PILLARS[city];
  const copy = COPY[city];
  return (
    <section className="py-20 md:py-24 bg-brand-navy relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Asymmetric split: editorial pull-quote left, compact proof right. */}
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="max-w-xl">
            <span className="text-accent-on-dark font-semibold text-sm uppercase tracking-wider">{copy.eyebrow}</span>
            <h2 className="display-serif display-2 text-white mt-3 mb-5">
              The Duty Clean <span className="text-accent-on-dark">Promise</span>
            </h2>
            <p className="display-serif display-quote font-normal text-white/95">&ldquo;{copy.quote}&rdquo;</p>
            <Link
              to="/satisfaction-guarantee/"
              className="mt-8 inline-flex min-h-[44px] items-center gap-2 text-accent-on-dark font-semibold hover:underline underline-offset-4 group"
            >
              Read our full Satisfaction Guarantee
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="motion-lift flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:bg-white/10"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/15">
                  <pillar.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/90">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
