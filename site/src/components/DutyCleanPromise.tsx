import { Link } from "react-router-dom";
import { BadgeCheck, HeartHandshake, Receipt, RotateCcw, type LucideIcon } from "lucide-react";
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
      // "You do not need to tidy before we arrive" contradicted the service
      // pages, which ask for clutter to be picked up. One sentence that is
      // true of both, worded identically on every page that makes the claim.
      desc: "You do not need to clean before the team comes: clear counters and floors get cleaned, cluttered ones get worked around, and decluttering or organising is a separate hourly add-on. Describe the home as it is on the booking form and the team arrives briefed. The jobs we do not take on are biohazards and infestations: bodily fluids, animal waste, mould remediation, pests and rodents.",
    },
    {
      icon: Receipt,
      title: "Priced on What You Tell Us",
      desc: "The price is flat by home size, worked out from what you enter on the booking form. Some things only show themselves once we start: heavy build-up, far more glass or cabinetry than the form described. When that happens, the team explains what it found and the options before carrying on.",
    },
    {
      icon: RotateCcw,
      title: `${POLICY.guaranteeWindowHours}-Hour Re-Clean Guarantee`,
      desc: `Tell us within ${POLICY.guaranteeWindowHours} hours if anything was missed and the team comes back to re-clean it at no charge. Photos help but are not required, and the commitment is the return visit rather than a refund.`,
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
      desc: "You do not need to clean before the team comes: clear counters and floors get cleaned, cluttered ones get worked around, and decluttering or organising is a separate hourly add-on. Say on the booking form what state the place is in, and the team comes prepared for it. The team does not take on bodily fluids, animal waste, mould remediation, pests or rodents.",
    },
    {
      icon: Receipt,
      title: "Priced on What You Tell Us",
      desc: "The quote comes from the home size you enter, and a clean that runs long costs the same. Some things only show up once the team is through the door: heavy build-up, more cabinets than expected, a glass railing. When the job is substantially bigger than described, the team tells you what it found and the options before carrying on.",
    },
    {
      icon: RotateCcw,
      title: "A Return Visit, at No Charge",
      desc: `Anything missed, reported within ${POLICY.guaranteeWindowHours} hours, is re-cleaned on a return visit at no charge. It is not a money-back guarantee, though you can always call the Calgary office to talk it through.`,
    },
  ],
};

const COPY = {
  Edmonton: {
    eyebrow: "Included With Every Clean",
    quote: "The team works through the checklist and stays until every task on it is done, however long the clean takes.",
  },
  Calgary: {
    eyebrow: "Standing terms, every Calgary visit",
    quote: "Calgary is hard on floors and easy on nothing. These terms come with every Calgary clean.",
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
              How the re-clean guarantee works
              <span className="dc-icon dc-icon-arrow-right w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
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
